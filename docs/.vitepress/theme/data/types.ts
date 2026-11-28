export interface FieldGuideItem {
  id: string
  name: string
  rawName: string
  lore: string
  icon: string
  category?: string
  dimension?: 'overworld' | 'nether' | 'end'
  gear?: string
  maxLevel?: string
  conflicts?: string[]
  source?: string
  anchor?: string
  link?: string
}
