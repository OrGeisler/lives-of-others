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
