<template>
  <div class="mc-gui-wrapper">
    <div class="mc-fg-container">
      <!-- 圖鑑主選單畫布：以 176x54 field_guide.png 作為背景 (3倍像素 528x162) -->
      <div 
        class="mc-fg-canvas"
        :style="{ backgroundImage: `url(${withBase('/textures/gui/field_guide.png')})` }"
      >
        <!-- 7 個圖鑑分類槽位 (y: 23px, 每格 18x18, 從 x: 25px 開始) -->
        <component
          :is="tab.link ? 'a' : 'div'"
          v-for="(tab, idx) in tabs"
          :key="idx"
          :href="tab.link ? withBase(tab.link) : undefined"
          class="mc-pos-item mc-tab-slot"
          :class="{
            active: tab.active,
            clickable: !!tab.link,
            selected: isMobileView && selectedIdx === idx
          }"
          :style="{
            left: ((25 + idx * 18) / 176 * 100) + '%',
            top: (23 / 54 * 100) + '%',
            width: (18 / 176 * 100) + '%',
            height: (18 / 54 * 100) + '%'
          }"
          @mouseenter="showTooltip($event, tab.name)"
          @mouseleave="hideTooltip"
          @click="onTabClick($event, tab, idx)"
        >
          <div class="mc-slot-highlight"></div>
          <img :src="withBase(tab.icon)" :alt="tab.rawName" class="mc-slot-icon" />
        </component>
      </div>

      <!-- 手機版點擊詳情卡 / 操作提示 -->
      <div v-if="isMobileView && selectedTab" class="mc-mobile-detail-card">
        <div class="mc-detail-header">
          <img :src="withBase(selectedTab.icon)" :alt="selectedTab.rawName" class="mc-detail-icon" />
          <div class="mc-detail-title" v-html="formatMinecraftText(selectedTab.name)"></div>
          <button type="button" class="mc-detail-close" aria-label="關閉詳情" @click="selectedIdx = null">✕</button>
        </div>
        <div v-if="selectedTab.link" class="mc-detail-actions">
          <a :href="withBase(selectedTab.link)" class="mc-detail-action">
            進入 {{ selectedTab.rawName }} →
          </a>
        </div>
      </div>
      <div v-else-if="isMobileView" class="mc-mobile-hint">
        點擊上方圖示查看分類，再次點擊已開放項目即可進入
      </div>
    </div>

    <!-- Minecraft 經典黑紫 Tooltip 懸浮窗 -->
    <div 
      ref="tooltipRef"
      class="mc-floating-tooltip"
      :class="{ visible: tooltip.visible, 'placement-bottom': tooltip.placement === 'bottom' }"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-title" v-html="formatMinecraftText(tooltip.title)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { formatMinecraftText } from '../utils/minecraftText'
import { useMcTooltip } from '../utils/useMcTooltip'

const tabs = ref([
  {
    rawName: '生物圖鑑',
    name: '&f生物圖鑑',
    icon: '/textures/item/menu/field_guide/creature_complete.png',
    link: '',
    active: false
  },
  {
    rawName: '素材圖鑑',
    name: '&f素材圖鑑',
    icon: '/textures/item/menu/field_guide/material_complete.png',
    link: '',
    active: false
  },
  {
    rawName: '食譜圖鑑',
    name: '&f食譜圖鑑',
    icon: '/textures/item/menu/field_guide/recipe_complete.png',
    link: '',
    active: false
  },
  {
    rawName: '突破圖鑑',
    name: '&f突破圖鑑',
    icon: '/textures/item/menu/field_guide/enchant_complete.png',
    link: '/guide/enchant',
    active: true
  },
  {
    rawName: '飾品圖鑑',
    name: '&f飾品圖鑑',
    icon: '/textures/item/menu/field_guide/accessory_complete.png',
    link: '',
    active: false
  },
  {
    rawName: '玩偶圖鑑',
    name: '&f玩偶圖鑑',
    icon: '/textures/item/menu/field_guide/plush_complete.png',
    link: '',
    active: false
  },
  {
    rawName: '空島圖鑑',
    name: '&f空島圖鑑',
    icon: '/textures/item/menu/field_guide/island_complete.png',
    link: '/guide/island',
    active: true
  }
])

const { tooltipRef, tooltip, isMobileView, showTooltip, hideTooltip } = useMcTooltip()

const selectedIdx = ref<number | null>(null)
const selectedTab = computed(() => (selectedIdx.value !== null ? tabs.value[selectedIdx.value] : null))

watch(isMobileView, (mobile) => {
  if (!mobile) {
    selectedIdx.value = null
  }
})

function onTabClick(event: MouseEvent, tab: (typeof tabs.value)[number], idx: number) {
  if (!isMobileView.value) return
  if (selectedIdx.value !== idx) {
    event.preventDefault()
    selectedIdx.value = idx
    return
  }
  if (!tab.link) {
    event.preventDefault()
  }
}
</script>

<style scoped>
.mc-gui-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  user-select: none;
}

.mc-fg-container {
  width: 100%;
  max-width: 528px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mc-fg-canvas {
  position: relative;
  width: 100%;
  max-width: 528px;
  height: auto;
  aspect-ratio: 176 / 54;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  border-radius: 4px;
}

.mc-pos-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.mc-tab-slot {
  cursor: default;
  text-decoration: none;
}

.mc-tab-slot.clickable {
  cursor: pointer;
}

.mc-tab-slot.selected .mc-slot-highlight {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 0 0 2px #ffaa00;
}

.mc-slot-highlight {
  position: absolute;
  inset: calc(1 / 18 * 100%);
  background-color: rgba(255, 255, 255, 0.45);
  opacity: 0;
  transition: opacity 0.05s ease-in-out;
  pointer-events: none;
  z-index: 2;
}

.mc-slot-icon {
  width: calc(16 / 18 * 100%);
  height: calc(16 / 18 * 100%);
  object-fit: contain;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  z-index: 1;
}

@media (hover: hover) {
  .mc-tab-slot:hover .mc-slot-highlight {
    opacity: 1;
  }
}

@media (max-width: 640px), (hover: none) and (pointer: coarse) {
  .mc-tab-slot {
    cursor: pointer;
  }
}
</style>
