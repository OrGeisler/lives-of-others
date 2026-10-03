// RLS / permissions test against the real DB — everything runs in one transaction and is rolled back.
// Usage: set -a; source ~/dev/.secrets/lives-of-others.env; set +a; node scripts/test-rls.mjs
import fs from 'node:fs'
import postgres from 'postgres'

const pooler = fs.readFileSync(new URL('../supabase/.temp/pooler-url', import.meta.url), 'utf8').trim()
const url = new URL(pooler)
url.password = process.env.SUPABASE_DB_PASSWORD
const sql = postgres(url.toString(), { ssl: 'require', max: 1, onnotice: () => {} })

let pass = 0, failN = 0
const ok = (name, cond) => { cond ? pass++ : failN++; console.log(`${cond ? '✅' : '❌'} ${name}`) }
const tryq = async (tx, q) => { await tx`savepoint s`; try { const r = await q(); await tx`release savepoint s`; return { r } } catch (e) { await tx`rollback to savepoint s`; return { e } } }
const as = async (tx, role, sub, email) => {
  await tx`reset role`
  await tx.unsafe(`set local role ${role}`)
  await tx`select set_config('request.jwt.claims', ${JSON.stringify(sub ? { sub, email, role } : { role })}, true)`
}

try {
  await sql.begin(async tx => {
    const ids = { stranger: crypto.randomUUID(), editor: crypto.randomUUID(), admin: crypto.randomUUID() }
    for (const [k, id] of Object.entries(ids)) {
      await tx`insert into auth.users (id, email, aud, role) values (${id}, ${k + '@rls-test.invalid'}, 'authenticated', 'authenticated')`
    }
    await tx`insert into public.staff_invites (email, role) values ('editor@rls-test.invalid','editor'), ('admin@rls-test.invalid','admin')`

    // anon
    await as(tx, 'anon')
    ok('anon reads active dogs', (await tx`select count(*)::int c from dogs`)[0].c > 0)
    ok('anon cannot read donors', !!(await tryq(tx, () => tx`select * from donors`)).e)
    ok('anon cannot insert dogs', !!(await tryq(tx, () => tx`insert into dogs (slug,name) values ('x','x')`)).e)
    ok('anon cannot read payments', !!(await tryq(tx, () => tx`select * from payments`)).e)

    // logged-in stranger (not invited)
    await as(tx, 'authenticated', ids.stranger, 'stranger@rls-test.invalid')
    ok('stranger: claim_staff → null', (await tx`select public.claim_staff() r`)[0].r === null)
    ok('stranger sees 0 donors', (await tx`select count(*)::int c from donors`)[0].c === 0)
    ok('stranger cannot insert donor', !!(await tryq(tx, () => tx`insert into donors (honor_name) values ('x')`)).e)
    ok('stranger cannot invite self', !!(await tryq(tx, () => tx`insert into staff_invites (email) values ('stranger@rls-test.invalid')`)).e)
    ok('stranger cannot make self staff', !!(await tryq(tx, () => tx`insert into staff (user_id,email,role) values (${ids.stranger},'s','admin')`)).e)

    // editor
    await as(tx, 'authenticated', ids.editor, 'editor@rls-test.invalid')
    ok('editor: claim_staff → editor', (await tx`select public.claim_staff() r`)[0].r === 'editor')
    const d = await tryq(tx, () => tx`insert into donors (honor_name, phone) values ('בדיקה', '0500000000') returning id`)
    ok('editor can insert donor', !d.e)
    const dog = (await tx`select id from dogs limit 1`)[0].id
    const sp = await tryq(tx, () => tx`insert into sponsorships (donor_id, dog_id, tier, status) values (${d.r?.[0]?.id}, ${dog}, 50, 'active') returning id`)
    ok('editor can insert sponsorship', !sp.e)
    ok('editor can log monthly update', !(await tryq(tx, () => tx`insert into updates_log (sponsorship_id, period, channel) values (${sp.r?.[0]?.id}, date_trunc('month', now())::date, 'whatsapp')`)).e)
    ok('editor can edit dogs', !(await tryq(tx, () => tx`update dogs set tagline = tagline where id = ${dog}`)).e)
    ok('editor cannot invite staff', !!(await tryq(tx, () => tx`insert into staff_invites (email) values ('x@rls-test.invalid')`)).e)
    ok('editor cannot promote self', (await tryq(tx, () => tx`update staff set role='admin' where user_id=${ids.editor} returning 1`)).r?.length === 0)

    // admin
    await as(tx, 'authenticated', ids.admin, 'admin@rls-test.invalid')
    ok('admin: claim_staff → admin', (await tx`select public.claim_staff() r`)[0].r === 'admin')
    ok('admin can invite staff', !(await tryq(tx, () => tx`insert into staff_invites (email) values ('new@rls-test.invalid')`)).e)
    ok('admin sees donors', (await tx`select count(*)::int c from donors`)[0].c >= 1)

    await tx`reset role`
    throw new Error('ROLLBACK')
  })
} catch (e) {
  if (e.message !== 'ROLLBACK') { console.error('test error:', e.message); failN++ }
}
await sql.end()
console.log(`\n${pass} passed, ${failN} failed (all changes rolled back)`)
process.exit(failN ? 1 : 0)
