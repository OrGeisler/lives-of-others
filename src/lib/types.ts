export type Dog = {
  id: string
  slug: string
  name: string
  age_text: string | null
  tagline: string | null
  story: string | null
  main_image: string | null
  gallery: string[]
  available_for_adoption: boolean
  available_for_virtual: boolean
  available_for_gift: boolean
  grow_virtual_link: string | null
  sort: number
}

export type Fallen = {
  id: string
  slug: string
  card_title: string
  modal_title: string | null
  eyebrow: string | null
  card_text: string | null
  story_html: string | null
  hero_image: string | null
  grow_link: string | null
  sort: number
}

export type TeamMember = { id: string; name: string; photo: string | null; sort: number }

export type Counter = { value: number; suffix: string; label: string }
