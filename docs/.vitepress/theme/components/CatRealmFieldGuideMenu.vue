<template>
  <div class="mc-gui-wrapper">
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
        :class="{ active: tab.active, clickable: !!tab.link }"
        :style="{
          left: ((25 + idx * 18) / 176 * 100) + '%',
          top: (23 / 54 * 100) + '%',
          width: (18 / 176 * 100) + '%',
          height: (18 / 54 * 100) + '%'
        }"
        @mouseenter="showTooltip($event, tab.name, tab.lore)"
        @mouseleave="hideTooltip"
      >
        <div class="mc-slot-highlight"></div>
        <img :src="withBase(tab.icon)" :alt="tab.rawName" class="mc-slot-icon" />
      </component>
    </div>

    <!-- Minecraft 經典黑紫 Tooltip 懸浮窗 -->
    <div 
      ref="tooltipRef"
      class="mc-floating-tooltip"
      :class="{ visible: tooltip.visible }"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-title" v-html="formatMinecraftText(tooltip.title)"></div>
      <div v-if="tooltip.lore" class="tooltip-lore" v-html="formatMinecraftText(tooltip.lore)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { withBase } from 'vitepress'

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

const tooltipRef = ref<HTMLElement | null>(null)
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  lore: ''
})

function showTooltip(event: MouseEvent, title: string, lore: string) {
  tooltip.title = title
  tooltip.lore = lore
  tooltip.visible = true

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  tooltip.x = rect.left + rect.width / 2
  tooltip.y = rect.top - 8
}

function hideTooltip() {
  tooltip.visible = false
}

function formatMinecraftText(text: string): string {
  if (!text) return ''
  const colorMap: Record<string, string> = {
    '0': '#000000', '1': '#0000aa', '2': '#00aa00', '3': '#00aaaa',
    '4': '#aa0000', '5': '#aa00aa', '6': '#ffaa00', '7': '#aaaaaa',
    '8': '#555555', '9': '#5555ff', 'a': '#55ff55', 'b': '#55ffff',
    'c': '#ff5555', 'd': '#ff55ff', 'e': '#ffff55', 'f': '#ffffff'
  }

  let formatted = text.replace(/&([0-9a-fk-or])/gi, (_, code) => {
    const c = code.toLowerCase()
    if (colorMap[c]) {
      return `</span><span style="color: ${colorMap[c]}">`
    } else if (c === 'l') {
      return `<span style="font-weight: bold">`
    } else if (c === 'o') {
      return `<span style="font-style: italic">`
    } else if (c === 'r') {
      return `</span><span style="color: #ffffff">`
    }
    return ''
  })

  formatted = formatted.replace(/\n/g, '<br/>')
  return `<span>${formatted}</span>`
}
</script>

<style scoped>
.mc-gui-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  user-select: none;
}

.mc-fg-canvas {
  position: relative;
  width: 528px;
  height: 162px;
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

.mc-tab-slot.clickable:hover .mc-slot-highlight {
  opacity: 1;
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
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  z-index: 1;
  transition: transform 0.1s ease;
}

.mc-tab-slot.clickable:hover .mc-slot-icon {
  transform: scale(1.1);
}

/* Minecraft 經典 Tooltip */
.mc-floating-tooltip {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  transform: translate(-50%, -100%);
  background: #100010;
  border: 2px solid;
  border-image-slice: 1;
  border-color: #2b0854 #18002d #18002d #2b0854;
  box-shadow: inset 0 0 0 1px #5000ff, 0 4px 12px rgba(0,0,0,0.7);
  padding: 6px 10px;
  border-radius: 4px;
  font-family: 'Minecraft', 'Unifont', monospace, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.1s ease;
}

.mc-floating-tooltip.visible {
  opacity: 1;
}

.tooltip-title {
  font-size: 14px;
  font-weight: normal;
  text-shadow: 2px 2px 0px #3f3f3f;
  margin-bottom: 4px;
}

.tooltip-lore {
  font-size: 14px;
  line-height: 1.45;
  text-shadow: 2px 2px 0px #3f3f3f;
}
</style>
