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
              clickable: !!(getItem(row - 1, col - 1)?.anchor || getItem(row - 1, col - 1)?.link),
              selected: isMobileView && selectedDetail?.key === `slot-${row}-${col}`
            }"
            :style="{
              left: ((7 + (col - 1) * 18) / 176 * 100) + '%',
              top: ((23 + (row - 1) * 18) / 144 * 100) + '%',
              width: (18 / 176 * 100) + '%',
              height: (18 / 144 * 100) + '%'
            }"
            @mouseenter="onSlotEnter($event, getItem(row - 1, col - 1))"
            @mouseleave="hideTooltip"
            @click="onSlotClick(row, col, getItem(row - 1, col - 1))"
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
          v-if="helpTitle || helpLore"
          class="mc-pos-item mc-ctrl-btn mc-help-btn"
          :class="{ selected: isMobileView && selectedDetail?.key === 'help' }"
          :style="{
            left: (80 / 176 * 100) + '%',
            top: (119 / 144 * 100) + '%',
            width: (16 / 176 * 100) + '%',
            height: (16 / 144 * 100) + '%'
          }"
          @mouseenter="showTooltip($event, helpTitle, formatHelpLore())"
          @mouseleave="hideTooltip"
          @click="onHelpClick"
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

      <!-- 手機版點擊詳情卡 / 操作提示 -->
      <div v-if="isMobileView && selectedDetail" class="mc-mobile-detail-card">
        <div class="mc-detail-header">
          <img :src="withBase(selectedDetail.icon)" :alt="selectedDetail.rawName" class="mc-detail-icon" />
          <div class="mc-detail-title" v-html="formatMinecraftText(selectedDetail.title)"></div>
          <button type="button" class="mc-detail-close" aria-label="關閉詳情" @click="selectedDetail = null">✕</button>
        </div>
        <div v-if="selectedDetail.lore" class="mc-detail-lore" v-html="formatMinecraftText(selectedDetail.lore)"></div>
        <div v-if="selectedDetail.link || hasAnchorTarget(selectedDetail.anchor)" class="mc-detail-actions">
          <a v-if="selectedDetail.link" :href="withBase(selectedDetail.link)" class="mc-detail-action">
            前往頁面 →
          </a>
          <button
            v-else-if="hasAnchorTarget(selectedDetail.anchor)"
            type="button"
            class="mc-detail-action"
            @click="scrollToAnchor(selectedDetail.anchor)"
          >
            跳至詳細說明 ↓
          </button>
        </div>
      </div>
      <div v-else-if="isMobileView" class="mc-mobile-hint">
        點擊圖鑑格子查看詳細資訊
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
import { useRouter, withBase } from 'vitepress'
import type { FieldGuideItem } from '../data/types'
import { formatMinecraftText } from '../utils/minecraftText'
import { useMcTooltip } from '../utils/useMcTooltip'

interface SelectedDetail {
  key: string
  icon: string
  rawName: string
  title: string
  lore: string
  link?: string
  anchor?: string
}

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
  helpTitle: '',
  helpLore: '',
  initialPage: 1
})

const router = useRouter()
const { tooltipRef, tooltip, isMobileView, showTooltip, hideTooltip } = useMcTooltip()

const currentPage = ref(props.initialPage)
const selectedDetail = ref<SelectedDetail | null>(null)

watch(isMobileView, (mobile) => {
  if (!mobile) {
    selectedDetail.value = null
  }
})

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
    selectedDetail.value = null
    hideTooltip()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    selectedDetail.value = null
    hideTooltip()
  }
}

function formatHelpLore(): string {
  return `${props.helpLore}\n&b當前頁數：&f第 ${currentPage.value} / ${totalPages.value} 頁`
}

function hasAnchorTarget(anchor?: string): boolean {
  return Boolean(anchor && typeof document !== 'undefined' && document.getElementById(anchor))
}

function scrollToAnchor(anchor?: string) {
  if (!anchor || typeof document === 'undefined') return
  const el = document.getElementById(anchor)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('mc-highlight-target')
    setTimeout(() => el.classList.remove('mc-highlight-target'), 2000)
  }
}

function onHelpClick() {
  if (!isMobileView.value) return
  selectedDetail.value = {
    key: 'help',
    icon: '/textures/item/menu/question.png',
    rawName: '說明',
    title: props.helpTitle || '&e圖鑑說明',
    lore: formatHelpLore()
  }
}

// 點擊物品：手機顯示詳情卡，桌機跳轉頁面或錨點
function onSlotClick(row: number, col: number, item?: FieldGuideItem) {
  if (!item) {
    selectedDetail.value = null
    return
  }

  if (isMobileView.value) {
    selectedDetail.value = {
      key: `slot-${row}-${col}`,
      icon: item.icon,
      rawName: item.rawName,
      title: item.name,
      lore: item.lore,
      link: item.link,
      anchor: item.anchor
    }
    return
  }

  if (item.link) {
    if (/^https?:\/\//.test(item.link)) {
      window.location.href = item.link
    } else {
      router.go(withBase(item.link))
    }
    return
  }
  if (item.anchor) {
    scrollToAnchor(item.anchor)
  }
}

function onSlotEnter(event: MouseEvent, item?: FieldGuideItem) {
  if (!item) {
    hideTooltip()
    return
  }
  showTooltip(event, item.name, item.lore)
}
</script>

<style scoped>
.mc-gui-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px 0;
  user-select: none;
}

.mc-field-guide-container {
  width: 100%;
  max-width: 528px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 核心畫布：176x144, 3倍放大 (528x432) */
.mc-grid-canvas {
  position: relative;
  width: 100%;
  max-width: 528px;
  height: auto;
  aspect-ratio: 176 / 144;
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

.mc-grid-slot.selected .mc-slot-highlight {
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

.mc-pixel-icon {
  width: 80%;
  height: 80%;
  max-width: 32px;
  max-height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  z-index: 1;
}

.mc-ctrl-btn .mc-pixel-icon,
.mc-tab-icon .mc-pixel-icon {
  width: 85%;
  height: 85%;
  max-width: 32px;
  max-height: 32px;
}

/* 控制按鈕 (問號、箭頭) */
.mc-ctrl-btn {
  cursor: pointer;
  transition: transform 0.1s ease;
}

.mc-help-btn.selected {
  transform: scale(1.1);
}

.mc-ctrl-btn.disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

@media (hover: hover) {
  .mc-grid-slot:hover .mc-slot-highlight {
    opacity: 1;
  }

  .mc-grid-slot:hover .mc-pixel-icon {
    transform: scale(1.1);
    transition: transform 0.1s ease;
  }

  .mc-ctrl-btn:hover:not(.disabled) {
    transform: scale(1.15);
  }
}

@media (max-width: 640px), (hover: none) and (pointer: coarse) {
  .mc-grid-slot.hasItem {
    cursor: pointer;
  }
}

/* 頁數指示器 */
.mc-page-indicator {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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

:global(.mc-highlight-target) {
  animation: pulse-border 1.5s ease-out;
}

@keyframes pulse-border {
  0% { outline: 3px solid #ffaa00; background-color: rgba(255, 170, 0, 0.15); }
  100% { outline: 3px solid transparent; background-color: transparent; }
}
</style>
