import { useEffect, useState } from 'react'
import Modal from './Modal'
import { toast } from './ui'
import { waLink } from './util'

export const SITE = 'https://lives-of-others.com'
export const certUrl = (id: string) => `${SITE}/certificate/${id}`

// One WhatsApp send window for the admin. A wa.me link can only carry text, so:
// 1. the message (editable) opens in WhatsApp to the right person, with links to the certificate/video;
// 2. on a phone, the files themselves (certificate image, video) go out through the share sheet.
type Props = {
  phone: string | null | undefined; to: string; text: string
  certId?: string; video?: string | null; dog?: string | null
  label?: string; className?: string; sent?: boolean
  onSent?: () => void
}

const canShareFiles = () => {
  try { return !!navigator.canShare?.({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] }) } catch { return false }
}
async function toFile(url: string, name: string): Promise<File> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(String(r.status))
  const b = await r.blob()
  return new File([b], name, { type: b.type || (name.endsWith('.jpg') ? 'image/jpeg' : 'video/mp4') })
}

export default function WaShare(p: Props) {
  const [open, setOpen] = useState(false)
  // inside clickable rows: keep clicks/keys in the window from opening the row's edit form
  return (
    <span className="ad-wa-share" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
      <button type="button" className={p.className ?? 'ad-btn wa sm'} onClick={() => setOpen(true)}
        title={p.sent ? 'כבר נשלח — אפשר לשלוח שוב' : `שליחה בוואטסאפ ל${p.to}`}>
        {p.label ?? '💬'}{p.sent ? ' ✓' : ''}
      </button>
      {open && <SendWindow {...p} onClose={() => setOpen(false)} />}
    </span>
  )
}

type FileState = { file?: File; busy?: boolean; err?: boolean }

function SendWindow({ phone, to, text, certId, video, dog, onSent, onClose }: Props & { onClose: () => void }) {
  const [msg, setMsg] = useState(text)
  const share = canShareFiles()
  const certJpg = certId ? `/api/certificate-pdf?id=${certId}&format=jpg` : ''
  const [cert, setCert] = useState<FileState>({})
  const [vid, setVid] = useState<FileState>({})
  const wa = waLink(phone, msg)

  // the certificate image takes a few seconds to render: start right away so it's ready when needed
  useEffect(() => {
    if (!share || !certJpg) return
    setCert({ busy: true })
    toFile(certJpg, `תעודת אימוץ - ${dog ?? ''}.jpg`).then(file => setCert({ file }), () => setCert({ err: true }))
  }, [share, certJpg, dog])

  const shareFile = async (file: File) => {
    try { await navigator.share({ files: [file] }); onSent?.() } catch (e) { if ((e as Error).name !== 'AbortError') toast('השיתוף לא הצליח, נסו שוב', true) }
  }
  // a big video can't be fetched inside the tap (the phone allows sharing only right after a tap): 1st tap loads, 2nd tap sends
  const videoTap = () => {
    if (vid.file) { shareFile(vid.file); return }
    if (vid.busy || !video) return
    setVid({ busy: true })
    toFile(video, `סרטון תודה - ${dog ?? ''}.${video.split('.').pop()?.split('?')[0] || 'mp4'}`).then(file => setVid({ file }), () => setVid({ err: true }))
  }

  return (
    <Modal title={`שליחה בוואטסאפ ל${to}`} onClose={onClose}>
      <div className="ad-form">
        <h3>1. ההודעה</h3>
        <textarea rows={7} value={msg} onChange={e => setMsg(e.target.value)} dir="rtl" />
        {wa
          ? <a className="ad-btn wa big" href={wa} target="_blank" rel="noopener" onClick={() => onSent?.()}>💬 פתיחת וואטסאפ עם ההודעה</a>
          : <p className="ad-error">חסר מספר טלפון — הוסיפו טלפון ונסו שוב.</p>}
        {certId && <p className="ad-hint">בהודעה יש קישור לתעודה{video ? ' ולסרטון התודה' : ''}: מי שמקבל לוחץ ורואה אותה, ויכול להוריד PDF.</p>}

        {(certId || video) && (
          <>
            <h3>2. לשלוח גם את הקבצים עצמם</h3>
            {share ? (
              <>
                <p className="ad-hint">אחרי ששלחתם את ההודעה: לוחצים כאן, בוחרים וואטסאפ ואת {to} — והקובץ נשלח בצ'אט.</p>
                <div className="ad-row-actions">
                  {certId && (
                    <button type="button" className="ad-btn" disabled={!cert.file} onClick={() => cert.file && shareFile(cert.file)}>
                      {cert.file ? '📜 שליחת התעודה (תמונה)' : cert.err ? '⚠️ התעודה לא נטענה' : '⏳ מכין את התעודה…'}
                    </button>
                  )}
                  {video && (
                    <button type="button" className="ad-btn" disabled={vid.busy} onClick={videoTap}>
                      {vid.file ? '🎬 שליחת הסרטון' : vid.busy ? '⏳ טוען סרטון…' : vid.err ? '⚠️ לא נטען — שוב' : '🎬 הכנת הסרטון'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="ad-hint">שליחת קבצים ישירות עובדת מהטלפון. במחשב: מורידים וגוררים לצ'אט בוואטסאפ ווב.</p>
                <div className="ad-row-actions">
                  {certId && <a className="ad-btn" href={certJpg} target="_blank" rel="noopener" download>⬇ התעודה כתמונה</a>}
                  {video && <a className="ad-btn" href={video} target="_blank" rel="noopener" download>⬇ הסרטון</a>}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}

// Message templates (staff can edit before sending)
export const sponsorCertText = (name: string, dog: string, id: string, video?: string | null) =>
  `היי ${name}! 😇\nתודה שהפכת למלאך השומר של ${dog} 💛\n\nהנה תעודת האימוץ שלך${video ? ` וסרטון תודה מ${dog} 🎬` : ''}:\n${certUrl(id)}\n\nבאהבה, עמותת חיים של אחרים 🐾`
