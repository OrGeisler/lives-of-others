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

  useEffect(() => {
    supabase.from('dogs').select('*').eq('id', id).single().then(({ data }) => setD(data as D))
  }, [id])
  if (!d) return <p>טוען…</p>

  const set = <K extends keyof D>(k: K, v: D[K]) => setD(x => x && { ...x, [k]: v })
  const photos = d.gallery ?? []

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(files.length)
    const added: string[] = []
    for (const f of Array.from(files)) {
      try { added.push(await uploadImage(f, `dogs/${d.slug}`)) } catch (e) { toast(`העלאה נכשלה: ${(e as Error).message}`, true) }
      setUploading(n => n - 1)
    }
    const gallery = [...photos, ...added]
    setD(x => x && { ...x, gallery, main_image: x.main_image || gallery[0] || null })
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
    const g = photos.filter(p => p !== src)
    setD(x => x && { ...x, gallery: g, main_image: x.main_image === src ? g[0] ?? null : x.main_image })
  }

  const save = async () => {
    setBusy(true)
    const slug = d.slug.startsWith('dog-') && /^\d+$/.test(d.slug.slice(4)) ? slugify(d.name) : d.slug
    const { error } = await supabase.from('dogs').update({
      name: d.name, slug, age_text: d.age_text, tagline: d.tagline, story: d.story, main_image: d.main_image, gallery: photos,
      available_for_adoption: d.available_for_adoption, available_for_virtual: d.available_for_virtual,
      available_for_gift: d.available_for_gift, active: d.active,
    }).eq('id', d.id)
    setBusy(false)
    if (!fail(error, 'השמירה')) { toast('נשמר — האתר מתעדכן מיד ✓'); set('slug', slug) }
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
        <button className="ad-btn ghost" onClick={() => nav('/admin/dogs')}>חזרה</button>
      </div>
    </>
  )
}
