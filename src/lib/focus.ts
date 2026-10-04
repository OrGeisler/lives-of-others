// Object-position for a dog's main photo: the point marked in the admin, else upper-centre
// (most dog photos are portrait with the face in the upper part, so a centred crop cuts the head).
export const DEFAULT_FOCUS = '50% 18%'
export const focusStyle = (d: { image_focus?: string | null } | null | undefined) => ({ objectPosition: d?.image_focus || DEFAULT_FOCUS })
