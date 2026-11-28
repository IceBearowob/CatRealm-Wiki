<template>
  <CatRealmFieldGuideGrid
    bg="/textures/gui/field_guide/island.png"
    :pages="islandPages"
  />
</template>

<script setup lang="ts">
import CatRealmFieldGuideGrid from './CatRealmFieldGuideGrid.vue'
import { islandPages } from '../data/islandData'
</script>
