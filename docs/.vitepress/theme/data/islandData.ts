import type { FieldGuideItem } from './types'

type IslandDimension = NonNullable<FieldGuideItem['dimension']>
type IslandSeed = readonly [id: string, rawName: string, dimension: IslandDimension, source?: string]

const DEFAULT_ISLAND_SOURCE = '生成新的隨機領地'

function createIslandItem([id, rawName, dimension, source = DEFAULT_ISLAND_SOURCE]: IslandSeed): FieldGuideItem {
  return {
    id,
    name: `&f${rawName}`,
    rawName,
    lore: `&7取得：${source}`,
    icon: `/textures/item/field_guide/island/${id}.png`,
    category: 'island',
    dimension,
    source
  }
}

const islandPage1Seeds: IslandSeed[] = [
  ['mushroom_fields', '蘑菇地', 'overworld'],
  ['stony_shore', '石岸', 'overworld'],
  ['swamp', '沼澤', 'overworld'],
  ['mangrove_swamp', '紅樹林沼澤', 'overworld'],
  ['snowy_slopes', '雪坡', 'overworld'],
  ['snowy_plains', '雪原', 'overworld'],
  ['snowy_beach', '冰雪沙灘', 'overworld'],
  ['windswept_gravelly_hills', '風蝕礫質丘陵', 'overworld'],
  ['grove', '雪林', 'overworld'],
  ['windswept_hills', '風蝕丘陵', 'overworld'],
  ['snowy_taiga', '冰雪針葉林', 'overworld'],
  ['windswept_forest', '風蝕森林', 'overworld'],
  ['taiga', '針葉林', 'overworld'],
  ['plains', '平原', 'overworld', '初始的一格空島，或生成新的隨機領地'],
  ['meadow', '草甸', 'overworld'],
  ['beach', '沙灘', 'overworld'],
  ['forest', '森林', 'overworld'],
  ['old_growth_spruce_taiga', '原生杉木針葉林', 'overworld'],
  ['flower_forest', '繁花森林', 'overworld'],
  ['birch_forest', '樺木森林', 'overworld'],
  ['dark_forest', '黑森林', 'overworld'],
  ['pale_garden', '蒼白之園', 'overworld'],
  ['savanna_plateau', '莽原高地', 'overworld'],
  ['savanna', '莽原', 'overworld'],
  ['jungle', '叢林', 'overworld'],
  ['badlands', '惡地', 'overworld'],
  ['desert', '沙漠', 'overworld'],
  ['wooded_badlands', '疏林惡地', 'overworld'],
  ['jagged_peaks', '尖峭山峰', 'overworld'],
  ['stony_peaks', '裸岩山峰', 'overworld'],
  ['frozen_river', '寒凍河流', 'overworld'],
  ['river', '河流', 'overworld'],
  ['ice_spikes', '冰刺', 'overworld'],
  ['dappled_forest', '斑駁森林', 'overworld'],
  ['old_growth_pine_taiga', '原生松木針葉林', 'overworld'],
  ['sunflower_plains', '向日葵平原', 'overworld'],
  ['old_growth_birch_forest', '原生樺木森林', 'overworld'],
  ['sparse_jungle', '稀疏叢林', 'overworld'],
  ['bamboo_jungle', '竹林', 'overworld'],
  ['eroded_badlands', '侵蝕惡地', 'overworld'],
  ['windswept_savanna', '風蝕莽原', 'overworld'],
  ['cherry_grove', '櫻花樹林', 'overworld'],
  ['frozen_peaks', '霜凍山峰', 'overworld'],
  ['dripstone_caves', '鐘乳石洞窟', 'overworld'],
  ['lush_caves', '蒼鬱洞窟', 'overworld']
]

const islandPage2Seeds: IslandSeed[] = [
  ['sulfur_caves', '硫磺洞窟', 'overworld'],
  ['deep_dark', '深淵', 'overworld'],
  ['crimson_forest', '緋紅森林', 'nether'],
  ['warped_forest', '扭曲森林', 'nether'],
  ['basalt_deltas', '玄武岩三角洲', 'nether'],
  ['nether_wastes', '地獄荒原', 'nether'],
  ['soul_sand_valley', '靈魂砂谷', 'nether'],
  ['end_highlands', '終界高地', 'end'],
  ['small_end_islands', '終界小島', 'end'],
  ['end_barrens', '終界荒地', 'end'],
  ['end_midlands', '終界平地', 'end']
]

export const islandPage1: FieldGuideItem[] = islandPage1Seeds.map(createIslandItem)
export const islandPage2: FieldGuideItem[] = islandPage2Seeds.map(createIslandItem)
export const islandPages = [islandPage1, islandPage2]
