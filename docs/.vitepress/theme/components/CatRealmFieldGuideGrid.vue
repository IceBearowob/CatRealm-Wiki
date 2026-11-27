<template>
  <div class="mc-gui-wrapper">
    <div class="mc-field-guide-container">
      <!-- 畫布：176x144, 3x 像素比 (528x432) -->
      <div 
        class="mc-grid-canvas"
        :style="{ backgroundImage: `url(${withBase(bg)})` }"
      >
        <!-- 頂部自訂 Tab 圖示 (若有傳入) -->
        <div 
          v-if="tabIcon" 
          class="mc-pos-item mc-tab-icon"
          :style="{
            left: ((80) / 176 * 100) + '%',
            top: ((3) / 144 * 100) + '%',
            width: ((16) / 176 * 100) + '%',
            height: ((16) / 144 * 100) + '%'
          }"
        >
          <img :src="withBase(tabIcon)" alt="Tab Icon" class="mc-pixel-icon" />
        </div>

        <!-- 9x5 = 45 個物品槽位 -->
        <template v-for="row in 5" :key="'row-' + row">
          <div
            v-for="col in 9"
            :key="'slot-' + row + '-' + col"
            class="mc-pos-item mc-grid-slot"
            :class="{ 
              hasItem: !!getItem(row - 1, col - 1),
              clickable: !!(getItem(row - 1, col - 1)?.anchor || getItem(row - 1, col - 1)?.link)
            }"
            :style="{
              left: ((7 + (col - 1) * 18) / 176 * 100) + '%',
              top: ((23 + (row - 1) * 18) / 144 * 100) + '%',
              width: (18 / 176 * 100) + '%',
              height: (18 / 144 * 100) + '%'
            }"
            @mouseenter="onSlotEnter($event, getItem(row - 1, col - 1))"
            @mouseleave="hideTooltip"
            @click="onSlotClick(getItem(row - 1, col - 1))"
          >
            <!-- 槽位懸浮高亮框 -->
            <div class="mc-slot-highlight"></div>

            <!-- 物品圖示 -->
            <img 
              v-if="getItem(row - 1, col - 1)"
              :src="withBase(getItem(row - 1, col - 1)!.icon)" 
              :alt="getItem(row - 1, col - 1)!.rawName" 
              class="mc-pixel-icon"
            />
          </div>
        </template>

        <!-- 底部功能列：問號說明按鈕 -->
        <div 
          class="mc-pos-item mc-ctrl-btn mc-help-btn"
          :style="{
            left: (80 / 176 * 100) + '%',
            top: (119 / 144 * 100) + '%',
            width: (16 / 176 * 100) + '%',
            height: (16 / 144 * 100) + '%'
          }"
          @mouseenter="showTooltip($event, helpTitle, formatHelpLore())"
          @mouseleave="hideTooltip"
        >
          <img :src="withBase('/textures/item/menu/question.png')" alt="Help" class="mc-pixel-icon" />
        </div>

        <!-- 底部功能列：上一頁箭頭 (←) -->
        <div 
          class="mc-pos-item mc-ctrl-btn mc-page-btn"
          :class="{ disabled: currentPage <= 1 }"
          :style="{
            left: (118 / 176 * 100) + '%',
            top: (119 / 144 * 100) + '%',
            width: (16 / 176 * 100) + '%',
            height: (16 / 144 * 100) + '%'
          }"
          @mouseenter="showTooltip($event, currentPage > 1 ? '&a上一頁' : '&7上一頁', '&7點擊切換至上一頁清單')"
          @mouseleave="hideTooltip"
          @click="prevPage"
        >
          <img 
            :src="withBase(currentPage > 1 ? '/textures/item/menu/last_page_on.png' : '/textures/item/menu/last_page_off.png')" 
            alt="Previous Page" 
            class="mc-pixel-icon" 
          />
        </div>

        <!-- 底部功能列：下一頁箭頭 (→) -->
        <div 
          class="mc-pos-item mc-ctrl-btn mc-page-btn"
          :class="{ disabled: currentPage >= totalPages }"
          :style="{
            left: (138 / 176 * 100) + '%',
            top: (119 / 144 * 100) + '%',
            width: (16 / 176 * 100) + '%',
            height: (16 / 144 * 100) + '%'
          }"
          @mouseenter="showTooltip($event, currentPage < totalPages ? '&a下一頁' : '&7下一頁', '&7點擊切換至下一頁清單')"
          @mouseleave="hideTooltip"
          @click="nextPage"
        >
          <img 
            :src="withBase(currentPage < totalPages ? '/textures/item/menu/next_page_on.png' : '/textures/item/menu/next_page_off.png')" 
            alt="Next Page" 
            class="mc-pixel-icon" 
          />
        </div>
      </div>

      <!-- 頁數標籤指示器 -->
      <div class="mc-page-indicator">
        <span class="page-badge">第 {{ currentPage }} / {{ totalPages }} 頁</span>
        <span class="slot-count">（本頁展示 {{ currentList.length }} / 45 格）</span>
      </div>
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
import { ref, computed, reactive, watch } from 'vue'
import { withBase } from 'vitepress'
import type { FieldGuideItem } from '../data/breakthroughData'

const props = withDefaults(defineProps<{
  bg?: string
  tabIcon?: string
  pages?: FieldGuideItem[][]
  items?: FieldGuideItem[]
  helpTitle?: string
  helpLore?: string
  initialPage?: number
}>(), {
  bg: '/textures/gui/field_guide/enchant.png',
  tabIcon: '',
  pages: undefined,
  items: () => [],
  helpTitle: '&e圖鑑操作說明',
  helpLore: '&7滑鼠懸浮物品可查看數值與效果\n&7點擊可快速跳轉至下方詳細解說\n&a支援多頁翻頁瀏覽！',
  initialPage: 1
})

const currentPage = ref(props.initialPage)

// 計算所有分頁清單
const computedPages = computed<FieldGuideItem[][]>(() => {
  if (props.pages && props.pages.length > 0) {
    return props.pages
  }
  if (props.items && props.items.length > 0) {
    const res: FieldGuideItem[][] = []
    const chunkSize = 45
    for (let i = 0; i < props.items.length; i += chunkSize) {
      res.push(props.items.slice(i, i + chunkSize))
    }
    return res
  }
  // 空白模板預設 1 頁全空
  return [[]]
})

const totalPages = computed(() => Math.max(1, computedPages.value.length))

const currentList = computed<FieldGuideItem[]>(() => {
  const pageIdx = Math.min(Math.max(1, currentPage.value), totalPages.value) - 1
  return computedPages.value[pageIdx] || []
})

// 根據 row (0..4) 與 col (0..8) 取得對應 index 的物品
function getItem(row: number, col: number): FieldGuideItem | undefined {
  const idx = row * 9 + col
  return currentList.value[idx]
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    hideTooltip()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    hideTooltip()
  }
}

function formatHelpLore(): string {
  return `${props.helpLore}\n&b當前頁數：&f第 ${currentPage.value} / ${totalPages.value} 頁`
}

// 點擊物品跳轉頁面或錨點
function onSlotClick(item?: FieldGuideItem) {
  if (!item) return
  if (item.link) {
    window.location.href = withBase(item.link)
    return
  }
  if (item.anchor) {
    const el = document.getElementById(item.anchor)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('mc-highlight-target')
      setTimeout(() => el.classList.remove('mc-highlight-target'), 2000)
    }
  }
}

// Tooltip 邏輯
const tooltipRef = ref<HTMLElement | null>(null)
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  lore: ''
})

function onSlotEnter(event: MouseEvent, item?: FieldGuideItem) {
  if (!item) {
    hideTooltip()
    return
  }
  showTooltip(event, item.name, item.lore)
}

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
  padding: 18px 0;
  user-select: none;
}

.mc-field-guide-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 核心畫布：176x144, 3倍放大 (528x432) */
.mc-grid-canvas {
  position: relative;
  width: 528px;
  height: 432px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.mc-pos-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.mc-grid-slot {
  position: absolute;
}

.mc-grid-slot.clickable {
  cursor: pointer;
}

.mc-grid-slot:hover .mc-slot-highlight {
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

.mc-pixel-icon {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  z-index: 1;
}

.mc-grid-slot:hover .mc-pixel-icon {
  transform: scale(1.1);
  transition: transform 0.1s ease;
}

/* 控制按鈕 (問號、箭頭) */
.mc-ctrl-btn {
  cursor: pointer;
  transition: transform 0.1s ease;
}

.mc-ctrl-btn:hover:not(.disabled) {
  transform: scale(1.15);
}

.mc-ctrl-btn.disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

/* 頁數指示器 */
.mc-page-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.page-badge {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}

.slot-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
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

:global(.mc-highlight-target) {
  animation: pulse-border 1.5s ease-out;
}

@keyframes pulse-border {
  0% { outline: 3px solid #ffaa00; background-color: rgba(255, 170, 0, 0.15); }
  100% { outline: 3px solid transparent; background-color: transparent; }
}
</style>
