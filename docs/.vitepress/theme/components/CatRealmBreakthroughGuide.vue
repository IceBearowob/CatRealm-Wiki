<template>
  <CatRealmFieldGuideGrid
    bg="/textures/gui/field_guide/enchant.png"
    :pages="breakthroughPages"
    help-title="&6突破圖鑑說明"
    help-lore="&7上方展示附魔突破台、16種精煉板與28種附魔石\n&b使用右下角箭頭可翻頁查看完整附魔石清單"
  />
</template>

<script setup lang="ts">
import CatRealmFieldGuideGrid from './CatRealmFieldGuideGrid.vue'
import { breakthroughPages } from '../data/breakthroughData'
</script>
