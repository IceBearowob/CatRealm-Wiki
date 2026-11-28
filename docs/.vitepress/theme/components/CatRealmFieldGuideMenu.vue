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
          @mouseenter="showTooltip($event, tab.name, tab.lore)"
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
        <div v-if="selectedTab.lore" class="mc-detail-lore" v-html="formatMinecraftText(selectedTab.lore)"></div>
        <div v-if="selectedTab.link" class="mc-detail-actions">
          <a :href="withBase(selectedTab.link)" class="mc-detail-action">
            進入 {{ selectedTab.rawName }} →
          </a>
        </div>
      </div>
      <div v-else-if="isMobileView" class="mc-mobile-hint">
        點擊上方圖示查看各圖鑑分類說明
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
      <div v-if="tooltip.lore" class="tooltip-lore" v-html="formatMinecraftText(tooltip.lore)"></div>
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
    name: '&a生物圖鑑',
    lore: '&7遇見後解鎖\n&8收集世界各地遇見的生物與怪物進度\n&8尚未開放',
    icon: '/textures/item/menu/field_guide/creature.png',
    link: '',
    active: false
  },
  {
    rawName: '素材圖鑑',
    name: '&b素材圖鑑',
    lore: '&7拿到後解鎖\n&8探索並收集各種珍貴礦石與原物料\n&8尚未開放',
    icon: '/textures/item/menu/field_guide/material.png',
    link: '',
    active: false
  },
  {
    rawName: '食譜圖鑑',
    name: '&d食譜圖鑑',
    lore: '&7吃下或喝下後解鎖\n&8品嚐並記錄貓域獨特的美食與佳釀\n&8尚未開放',
    icon: '/textures/item/menu/field_guide/recipe.png',
    link: '',
    active: false
  },
  {
    rawName: '突破圖鑑',
    name: '&6突破圖鑑',
    lore: '&a可突破附魔石與精煉板\n&7查看所有可突破裝備、數值與附魔效果\n&e【點擊進入】突破圖鑑子頁面',
    icon: '/textures/item/menu/field_guide/enchant.png',
    link: '/guide/enchant',
    active: true
  },
  {
    rawName: '飾品圖鑑',
    name: '&e飾品圖鑑',
    lore: '&7拿到後解鎖\n&8收集特殊功能飾品與被動強化道具\n&8尚未開放',
    icon: '/textures/item/menu/field_guide/accessory.png',
    link: '',
    active: false
  },
  {
    rawName: '玩偶圖鑑',
    name: '&c玩偶圖鑑',
    lore: '&7拿到後解鎖\n&8珍藏各式各樣可愛的吉祥物與生物玩偶\n&8尚未開放',
    icon: '/textures/item/menu/field_guide/plush.png',
    link: '',
    active: false
  },
  {
    rawName: '空島圖鑑',
    name: '&a空島圖鑑',
    lore: '&a56 種生態域空島\n&7踏上後解鎖，記錄空島世界中踏足的生態域\n&e【點擊進入】空島圖鑑子頁面',
    icon: '/textures/item/menu/field_guide/island.png',
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
  inset: 1px;
  background-color: rgba(255, 255, 255, 0.45);
  opacity: 0;
  transition: opacity 0.05s ease-in-out;
  pointer-events: none;
  z-index: 2;
}

.mc-slot-icon {
  width: 80%;
  height: 80%;
  max-width: 32px;
  max-height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  z-index: 1;
  transition: transform 0.1s ease;
}

@media (hover: hover) {
  .mc-tab-slot.clickable:hover .mc-slot-highlight {
    opacity: 1;
  }

  .mc-tab-slot.clickable:hover .mc-slot-icon {
    transform: scale(1.1);
  }
}

@media (max-width: 640px), (hover: none) and (pointer: coarse) {
  .mc-tab-slot {
    cursor: pointer;
  }
}
</style>
