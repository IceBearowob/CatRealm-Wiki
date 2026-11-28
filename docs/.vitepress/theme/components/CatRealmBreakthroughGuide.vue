<template>
  <CatRealmFieldGuideGrid
    bg="/textures/gui/field_guide/enchant.png"
    :pages="breakthroughPages"
  />
</template>

<script setup lang="ts">
import CatRealmFieldGuideGrid from './CatRealmFieldGuideGrid.vue'
import { breakthroughPages } from '../data/breakthroughData'
</script>
