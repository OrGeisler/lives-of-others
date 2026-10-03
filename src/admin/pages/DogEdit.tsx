import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Dog } from '../../lib/types'
import { uploadImage } from '../image'
import { Field, Help, PageHead, fail, toast } from '../ui'
import { slugify } from '../util'

type D = Dog & { active: boolean }

export default function DogEdit() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const [d, setD] = useState<D | null>(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [dirty, setDirty] = useState(false)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    supabase.from('dogs').select('*').eq('id', id).maybeSingle().then(({ data, error }) => { if (error || !data) setMissing(true); else setD(data as D) })
  }, [id])
  // warn before leaving the page with unsaved changes (e.g. freshly uploaded photos)
  useEffect(() => {
    if (!dirty) return
    const h = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty])
  if (missing) return <p>הכלב לא נמצא. <Link to="/admin/dogs">לכל הכלבים ←</Link></p>
  if (!d) return <p>טוען…</p>

  const set = <K extends keyof D>(k: K, v: D[K]) => { setDirty(true); setD(x => x && { ...x, [k]: v }) }
  const photos = d.gallery ?? []

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(files.length)
    const added: string[] = []
    for (const f of Array.from(files)) {
      try { added.push(await uploadImage(f, `dogs/${d.slug}`)) } catch (e) { toast(`העלאה נכשלה: ${(e as Error).message}`, true) }
      setUploading(n => n - 1)
    }
    // functional update: photos removed/reordered while uploading are not overwritten
    setDirty(true)
    setD(x => { if (!x) return x; const gallery = [...(x.gallery ?? []), ...added]; return { ...x, gallery, main_image: x.main_image || gallery[0] || null } })
    if (added.length) toast(`${added.length} תמונות נוספו — לא לשכוח ללחוץ שמירה`)
  }
  const movePhoto = (i: number, dir: -1 | 1) => {
    const g = [...photos]; const j = i + dir
    if (j < 0 || j >= g.length) return
    ;[g[i], g[j]] = [g[j], g[i]]
    set('gallery', g)
  }
  const removePhoto = (src: string) => {
    if (!confirm('להסיר את התמונה מהכלב?')) return
    setDirty(true)
    setD(x => { if (!x) return x; const g = (x.gallery ?? []).filter(p => p !== src); return { ...x, gallery: g, main_image: x.main_image === src ? g[0] ?? null : x.main_image } })
  }

  const save = async () => {
    setBusy(true)
    const slug = d.slug.startsWith('dog-') && /^\d+$/.test(d.slug.slice(4)) ? slugify(d.name) : d.slug
    const { error } = await supabase.from('dogs').update({
      name: d.name, slug, age_text: d.age_text, tagline: d.tagline, story: d.story, main_image: d.main_image, gallery: photos,
      available_for_adoption: d.available_for_adoption, available_for_virtual: d.available_for_virtual,
      available_for_gift: d.available_for_gift, active: d.active, grow_virtual_link: d.grow_virtual_link,
    }).eq('id', d.id)
    setBusy(false)
    if (!fail(error, 'השמירה')) { toast('נשמר — האתר מתעדכן מיד ✓'); setD(x => x && { ...x, slug }); setDirty(false) }
  }

  return (
    <>
      <PageHead title={`עריכה: ${d.name}`}>
        <Link className="ad-btn ghost" to="/admin/dogs">→ לכל הכלבים</Link>
        {d.active && <a className="ad-btn ghost" href={`/dogs/${d.slug}`} target="_blank" rel="noopener">צפייה באתר ↗</a>}
      </PageHead>
      <Help>משנים מה שצריך ולוחצים <b>שמירה</b> למטה. השינויים מופיעים באתר מיד.</Help>

      <div className="ad-form ad-box">
        <label className="ad-switch big"><input type="checkbox" checked={d.active} onChange={e => set('active', e.target.checked)} /> <span>{d.active ? '✅ מוצג באתר' : '🙈 מוסתר מהאתר'}</span></label>
        <div className="ad-grid2">
          <Field label="שם"><input value={d.name} onChange={e => set('name', e.target.value)} /></Field>
          <Field label="גיל" hint='למשל: "שנתיים ו-5 חודשים"'><input value={d.age_text ?? ''} onChange={e => set('age_text', e.target.value)} /></Field>
        </div>
        <Field label="משפט קצר (כותרת משנה)" hint='למשל: "המלך של בית המחסה"'><input value={d.tagline ?? ''} onChange={e => set('tagline', e.target.value)} /></Field>
        <Field label="הסיפור של הכלב" hint="שורה ריקה בין פסקאות = פסקה חדשה באתר">
          <textarea rows={12} value={d.story ?? ''} onChange={e => set('story', e.target.value)} />
        </Field>
        <div className="ad-checks">
          <label className="ad-check"><input type="checkbox" checked={d.available_for_adoption} onChange={e => set('available_for_adoption', e.target.checked)} /> זמין לאימוץ (כפתור "אמצו אותי")</label>
          <label className="ad-check"><input type="checkbox" checked={d.available_for_virtual} onChange={e => set('available_for_virtual', e.target.checked)} /> זמין לאימוץ וירטואלי</label>
          <label className="ad-check"><input type="checkbox" checked={d.available_for_gift} onChange={e => set('available_for_gift', e.target.checked)} /> מופיע בעמוד "אימוץ במתנה"</label>
        </div>
        <Field label="קישור Grow אישי לכלב (לא חובה)" hint="אם פתחתם ב-Grow דף תשלום נפרד לכלב הזה — הדביקו כאן, והאימוץ הווירטואלי שלו יעבור לשם. ריק = דף האימוץ הכללי">
          <input dir="ltr" placeholder="https://pay.grow.link/..." value={d.grow_virtual_link ?? ''} onChange={e => set('grow_virtual_link', e.target.value.trim() || null)} />
        </Field>
      </div>

      <div className="ad-box">
        <h2 className="ad-h2">תמונות</h2>
        <p className="ad-hint">⭐ = התמונה הראשית (בכרטיס הכלב). החיצים משנים את הסדר בגלריה. אפשר לבחור כמה תמונות ביחד מהטלפון.</p>
        <div className="ad-photos">
          {photos.map((src, i) => (
            <div key={src} className={`ad-photo${d.main_image === src ? ' main' : ''}`}>
              <img src={src} alt="" />
              <div className="ad-photo-actions">
                <button onClick={() => set('main_image', src)} title="תמונה ראשית" aria-label="תמונה ראשית">{d.main_image === src ? '⭐' : '☆'}</button>
                <button onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label="הזזה אחורה">→</button>
                <button onClick={() => movePhoto(i, 1)} disabled={i === photos.length - 1} aria-label="הזזה קדימה">←</button>
                <button onClick={() => removePhoto(src)} aria-label="הסרה">🗑</button>
              </div>
            </div>
          ))}
          <label className="ad-photo add">
            <input type="file" accept="image/*" multiple onChange={e => { onFiles(e.target.files); e.target.value = '' }} />
            <span>{uploading ? `מעלה… (${uploading})` : '➕ הוספת תמונות'}</span>
          </label>
        </div>
      </div>

      <div className="ad-sticky-save">
        <button className="ad-btn primary big" onClick={save} disabled={busy || uploading > 0}>{busy ? 'שומר…' : '💾 שמירה'}</button>
        <button className="ad-btn ghost" onClick={() => { if (!dirty || confirm('יש שינויים שלא נשמרו. לצאת בלי לשמור?')) nav('/admin/dogs') }}>חזרה</button>
        {dirty && <span className="ad-unsaved">● יש שינויים שלא נשמרו</span>}
      </div>
    </>
  )
}
