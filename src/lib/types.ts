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
  active?: boolean
  image_focus?: string | null
  thanks_video_url?: string | null
  sex?: 'm' | 'f' | null
  name_en?: string | null; tagline_en?: string | null; story_en?: string | null; age_en?: string | null
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
  // 26.10: English (same /homes page in /en)
  card_title_en?: string | null; modal_title_en?: string | null; eyebrow_en?: string | null; card_text_en?: string | null; story_html_en?: string | null
}

export type TeamMember = { id: string; name: string; name_en?: string | null; photo: string | null; sort: number }

export type Counter = { value: number; suffix: string; label: string }
