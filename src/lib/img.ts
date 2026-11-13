import { SMALL } from './imgVariants'

// <img {...sized(src)}>: phones get the 700px copy (scripts/optimize-images.py), wide screens the full photo.
// Photos without a copy (e.g. new uploads in Supabase storage) keep a plain src.
export function sized(src: string | null | undefined, sizes = '(max-width: 760px) 50vw, 340px') {
  const w = src ? SMALL.get(src) : undefined
  if (!src || !w) return { src: src ?? undefined }
  return { src, srcSet: `${src.replace(/\.jpg$/, '-sm.jpg')} ${w[0]}w, ${src} ${w[1]}w`, sizes }
}
