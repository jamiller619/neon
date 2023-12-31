import slug from 'slug'

slug.charmap['.'] = '-'

export function slugify(str: string) {
  return slug(str.trim())
}
