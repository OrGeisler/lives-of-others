import { supabase } from '../lib/supabase'

// Phone photos are often 5–10MB: shrink to max 1600px JPEG before upload.
async function shrink(file: File, max = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  return await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.85))
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const blob = await shrink(file)
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`
  const { error } = await supabase.storage.from('media').upload(path, blob, { contentType: 'image/jpeg' })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

// Videos go up as-is (no re-encoding in the browser). Supabase's free plan caps a file at 50MB.
export const VIDEO_MAX_MB = 50
export async function uploadVideo(file: File, folder: string): Promise<string> {
  if (file.size > VIDEO_MAX_MB * 1024 * 1024) throw new Error(`הסרטון גדול מ-${VIDEO_MAX_MB}MB. שלחו אותו לעצמכם בוואטסאפ ושמרו את הגרסה הדחוסה, או קצרו אותו`)
  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type || 'video/mp4' })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}
