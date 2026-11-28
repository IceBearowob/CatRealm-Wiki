<template>
  <div class="mc-gui-wrapper">
    <div class="mc-menu-container">
      <!-- 主視窗畫布：以官方 176x102 root.png 作為 100% 原始背景底圖 -->
      <div
        class="mc-gui-canvas"
        :style="{ backgroundImage: `url(${withBase('/textures/gui/root.png')})` }"
      >
        <!-- 上半部：左橫幅 (營火列隊 36x36，內圖 34x34) -->
        <div
          class="mc-pos-item mc-banner-left"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'banner-left' }"
          @mouseenter="showTooltip($event, '[click] &f房間開始列隊', '[command] &8/room queue')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'banner-left',
            icon: withBase('/textures/item/menu/root/room/stopping_on.png'),
            rawName: '房間開始列隊',
            title: '[click] &f房間開始列隊',
            lore: '[command] &8/room queue'
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img
            :src="withBase('/textures/item/menu/root/room/stopping_on.png')"
            alt="房間開始列隊"
            class="mc-banner-left-img"
          />
        </div>

        <!-- 上半部：中橫幅 (PARTY TIME! 90x36，內圖 88x34) -->
        <div
          class="mc-pos-item mc-banner-main"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'banner-main' }"
          @mouseenter="showTooltip($event, '&f周年快樂', '&f從地上的驚喜盒內開出道具或金幣，\n&f時間結束時將所有金幣兌換成貓幣！\n\n[click] &f切換房間模式\n[command] &8/room mode')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'banner-main',
            icon: withBase('/gui/banner-party.png'),
            rawName: '周年快樂',
            title: '&f周年快樂',
            lore: '&f從地上的驚喜盒內開出道具或金幣，\n&f時間結束時將所有金幣兌換成貓幣！\n\n[click] &f切換房間模式\n[command] &8/room mode'
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img
            :src="withBase('/gui/banner-party.png')"
            alt="PARTY TIME!"
            class="mc-banner-main-img"
          />
        </div>

        <!-- 中橫幅左下疊加按鈕：說明 (?) -->
        <div
          class="mc-pos-item mc-banner-guide"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'banner-guide' }"
          @mouseenter="showTooltip($event, '[click] &f查看說明', '&7查看當前遊戲模式的玩法規則與獎勵說明')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'banner-guide',
            icon: withBase('/textures/item/menu/root/room/guide.png'),
            rawName: '查看說明',
            title: '[click] &f查看說明',
            lore: '&7查看當前遊戲模式的玩法規則與獎勵說明'
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img
            :src="withBase('/textures/item/menu/root/room/guide.png')"
            alt="查看說明"
            class="mc-slot-img"
          />
        </div>

        <!-- 中橫幅右下疊加按鈕：編輯房間配置 (齒輪) -->
        <div
          class="mc-pos-item mc-banner-setup"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'banner-setup' }"
          @mouseenter="showTooltip($event, '[click] &f編輯房間配置', '')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'banner-setup',
            icon: withBase('/textures/item/menu/root/room/setup_on.png'),
            rawName: '編輯房間配置',
            title: '[click] &f編輯房間配置',
            lore: ''
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img
            :src="withBase('/textures/item/menu/root/room/setup_on.png')"
            alt="編輯房間配置"
            class="mc-slot-img"
          />
        </div>

        <!-- 上半部：右側 2x2 頭像與陪玩區 -->
        <div
          class="mc-pos-item mc-head head-0"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'head-0' }"
          @mouseenter="showTooltip($event, '&f當前玩家', '&7房主\n\n[click] &f顯示玩家狀態')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'head-0',
            icon: withBase('/gui/head-player.png'),
            rawName: '當前玩家',
            title: '&f當前玩家',
            lore: '&7房主\n\n[click] &f顯示玩家狀態'
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img
            :src="withBase('/gui/head-player.png')"
            alt="當前玩家"
            class="mc-slot-img"
          />
        </div>

        <div
          class="mc-pos-item mc-head head-1"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'head-1' }"
          @mouseenter="showTooltip($event, '&7邀請玩家加入房間', '[click] &f邀請玩家加入房間\n[command] &8/room invite')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'head-1',
            rawName: '邀請玩家加入房間',
            title: '&7邀請玩家加入房間',
            lore: '[click] &f邀請玩家加入房間\n[command] &8/room invite'
          })"
        >
          <div class="mc-slot-highlight"></div>
        </div>

        <!-- 右下雙格合併：陪玩（測試中）(36x18) -->
        <div
          class="mc-pos-item mc-companion"
          :class="{ selected: isMobileView && selectedMenuItem?.key === 'companion' }"
          @mouseenter="showTooltip($event, '&f陪玩（測試中）', '&f找老玩家陪你玩，或去陪剛來的新玩家\n[warning] &f陪玩期間的聊天與操作會被記錄\n\n[click] &f開啟選單\n[command] &8/companion')"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: 'companion',
            icon: withBase('/gui/companion.png'),
            rawName: '陪玩（測試中）',
            title: '&f陪玩（測試中）',
            lore: '&f找老玩家陪你玩，或去陪剛來的新玩家\n[warning] &f陪玩期間的聊天與操作會被記錄\n\n[click] &f開啟選單\n[command] &8/companion'
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img
            :src="withBase('/gui/companion.png')"
            alt="陪玩（測試中）"
            class="mc-pixel-img"
          />
        </div>

        <!-- 中間：9 格核心物品欄 (y: 53px, 每格 18x18) -->
        <component
          :is="slot.link ? 'a' : 'div'"
          v-for="(slot, idx) in slots"
          :key="idx"
          :href="slot.link ? withBase(slot.link) : undefined"
          class="mc-pos-item mc-slot-item"
          :class="{
            'is-circle': idx === 0,
            selected: isMobileView && selectedMenuItem?.key === `slot-${idx}`
          }"
          :style="{ left: ((7 + idx * 18) / 176 * 100) + '%' }"
          @mouseenter="showTooltip($event, slot.name, slot.lore)"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: `slot-${idx}`,
            icon: slot.icon,
            rawName: slot.rawName,
            title: slot.name,
            lore: slot.lore,
            link: slot.link
          })"
        >
          <div class="mc-slot-highlight"></div>
          <img :src="slot.icon" :alt="slot.rawName" class="mc-slot-img" />
        </component>

        <!-- 底部：9 格資訊與快捷按鈕列 (y: 75px, 每格 18x18) -->
        <component
          :is="item.link ? 'a' : 'div'"
          v-for="(item, idx) in bottomItems"
          :key="'b-' + idx"
          :href="item.link ? withBase(item.link) : undefined"
          class="mc-pos-item mc-bottom-item"
          :class="{ selected: isMobileView && selectedMenuItem?.key === `bottom-${idx}` }"
          :style="{ left: ((7 + idx * 18) / 176 * 100) + '%' }"
          @mouseenter="showTooltip($event, item.name, item.lore)"
          @mouseleave="hideTooltip"
          @click="onMenuItemClick($event, {
            key: `bottom-${idx}`,
            icon: item.icon,
            rawName: item.rawName,
            title: item.name,
            lore: item.lore,
            link: item.link
          })"
        >
          <div class="mc-slot-highlight round"></div>
          <img :src="item.icon" :alt="item.rawName" class="mc-bottom-img" />
        </component>
      </div>

      <!-- 手機版點擊詳情卡 / 操作提示 -->
      <div v-if="isMobileView && selectedMenuItem" class="mc-mobile-detail-card">
        <div class="mc-detail-header">
          <img
            v-if="selectedMenuItem.icon"
            :src="selectedMenuItem.icon"
            :alt="selectedMenuItem.rawName"
            class="mc-detail-icon"
          />
          <div class="mc-detail-title" v-html="formatMenuText(selectedMenuItem.title)"></div>
          <button type="button" class="mc-detail-close" aria-label="關閉詳情" @click="selectedMenuItem = null">✕</button>
        </div>
        <div v-if="selectedMenuItem.lore" class="mc-detail-lore" v-html="formatMenuText(selectedMenuItem.lore)"></div>
        <div v-if="selectedMenuItem.link" class="mc-detail-actions">
          <a :href="withBase(selectedMenuItem.link)" class="mc-detail-action">
            前往 {{ selectedMenuItem.rawName }} →
          </a>
        </div>
      </div>
      <div v-else-if="isMobileView" class="mc-mobile-hint">
        點擊選單項目查看功能說明
      </div>
    </div>

    <!-- Minecraft 經典黑紫 Tooltip 懸浮窗 -->
    <div
      ref="tooltipRef"
      class="mc-floating-tooltip"
      :class="{ visible: tooltip.visible, 'placement-bottom': tooltip.placement === 'bottom' }"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-title" v-html="formatMenuText(tooltip.title)"></div>
      <div v-if="tooltip.lore" class="tooltip-lore" v-html="formatMenuText(tooltip.lore)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { formatMinecraftText, type InlineEmojiEntry } from '../utils/minecraftText'
import { useMcTooltip } from '../utils/useMcTooltip'

interface SelectedMenuItem {
  key: string
  icon?: string
  rawName: string
  title: string
  lore: string
  link?: string
}

// 核心 9 格物品欄設定（依據遊戲內實際材質與 Tooltip）
const slots = ref([
  {
    rawName: '鐵牌',
    name: '&f鐵牌',
    lore: '&7當前積分賽季牌位\n&7持有牌位點數可解鎖賽季獎勵\n\n[click] &f查看賽季獎勵\n[command] &8/rank',
    icon: withBase('/textures/item/menu/rank/iron_rank.png'),
    link: ''
  },
  {
    rawName: '信標',
    name: '&f信標',
    lore: '&f紀錄當前位置並且能夠隨時傳送回來\n[warning] &f傳送不會檢查目的地是否安全',
    icon: withBase('/textures/item/menu/root/beacon.png'),
    link: ''
  },
  {
    rawName: '足跡',
    name: '&f足跡',
    lore: '&f離開領地時留下足跡，60 分鐘內可以傳送回到領地中心\n[warning] &f到訪時不允許設置傳送點的領地無法傳送回去',
    icon: withBase('/textures/item/menu/root/trail.png'),
    link: ''
  },
  {
    rawName: '領地',
    name: '&f領地',
    lore: '&f主世界 4 / 0\n&7已被 [copper_rank] &f範例玩家 [shutdown] &7宣告\n\n&f刪減或調整玩家權限／配置特殊保護功能\n[warning] &f超過一年未登入會被清除',
    icon: withBase('/textures/item/menu/root/land.png'),
    link: ''
  },
  {
    rawName: '輔助',
    name: '&f輔助',
    lore: '&f永久夜視／顯示血量／靈魂出竅／整理背包／..\n&f免安裝模組即可使用模組功能',
    icon: withBase('/textures/item/menu/root/buff.png'),
    link: ''
  },
  {
    rawName: '朋友',
    name: '&f朋友',
    lore: '&f使用 [command] /go 快速傳送到朋友的身旁\n&f或隨時追蹤線上朋友的地理位置',
    icon: withBase('/textures/item/menu/root/friend.png'),
    link: ''
  },
  {
    rawName: '信箱',
    name: '&f信箱',
    lore: '&7未讀 &e9 &6✉\n\n&f寄送或接收含有貓幣／物品／指令附件的郵件\n&f可批量選擇要已讀或刪除的郵件\n[warning] &f被屏蔽玩家寄來的郵件將直接被銷毀',
    icon: withBase('/textures/item/menu/root/mail.png'),
    link: ''
  },
  {
    rawName: '圖鑑',
    name: '&f圖鑑',
    lore: '&7解鎖總進度 &e22% &7（151 / 657）\n\n&f收集遇見的生物、拿到的素材與飾品\n&f以及吃過的食譜、踏上的空島',
    icon: withBase('/textures/item/menu/root/guide.png'),
    link: '/guide/index'
  },
  {
    rawName: '更多',
    name: '&f更多',
    lore: '&f許多也實用但不常用的功能集',
    icon: withBase('/textures/item/menu/root/more_chevron.png'),
    link: ''
  }
])

// 底部資訊與快捷按鈕列 9 個小圖示
const bottomItems = ref([
  {
    rawName: '線上',
    name: '&f線上',
    lore: '&7顯示當前伺服器線上人數與玩家資訊',
    icon: withBase('/textures/item/menu/root/online.png'),
    link: ''
  },
  {
    rawName: '性能',
    name: '&f性能',
    lore: '&7伺服器當前運行效能 (TPS / MSPT)',
    icon: withBase('/textures/item/menu/root/performance/green.png'),
    link: ''
  },
  {
    rawName: '延遲',
    name: '&f延遲',
    lore: '&7當前與伺服器的網路連線延遲 (Ping)',
    icon: withBase('/textures/item/menu/root/ping/green.png'),
    link: ''
  },
  {
    rawName: '飛行',
    name: '&f飛行',
    lore: '&7領地自由飛行剩餘體力\n&7持有月卡享無限的領地飛行體力',
    icon: withBase('/textures/item/menu/root/flight/unlimited.png'),
    link: ''
  },
  {
    rawName: '錢包 / 月卡',
    name: '&f錢包 / 月卡',
    lore: '&7查看當前貓幣餘額與月卡剩餘時間\n&7需要轉帳時用信箱的附件功能',
    icon: withBase('/textures/item/menu/root/balance_pass.png'),
    link: ''
  },
  {
    rawName: '簽到',
    name: '&f簽到',
    lore: '&7每天簽到獲得獎勵\n&c今日未簽到',
    icon: withBase('/textures/item/menu/root/sign/off.png'),
    link: ''
  },
  {
    rawName: '任務',
    name: '&f任務',
    lore: '&7完成任務獲得獎勵\n&7尚有 &c3 &7項任務待完成',
    icon: withBase('/textures/item/menu/root/task/3.png'),
    link: ''
  },
  {
    rawName: '靈魂出竅',
    name: '&f靈魂出竅',
    lore: '&7進入觀察者視角四處探索並預覽容器\n[command] &8/soul',
    icon: withBase('/textures/item/menu/root/soul_sighting_off.png'),
    link: ''
  },
  {
    rawName: '整理背包',
    name: '&f整理背包',
    lore: '&7快速排序整理背包或容器內所有物品\n[command] &8/sort',
    icon: withBase('/textures/item/menu/root/organize_backpack.png'),
    link: ''
  }
])

// 內嵌官方像素 Emoji 對應表
const inlineEmojiMap: Record<string, InlineEmojiEntry> = {
  click: { src: withBase('/textures/emoji/click.png'), alt: '點擊' },
  command: { src: withBase('/textures/emoji/command.png'), alt: '指令' },
  warning: { src: withBase('/textures/emoji/warning.png'), alt: '警告' },
  copper_rank: { src: withBase('/textures/item/menu/rank/copper_rank.png'), alt: '銅牌' },
  shutdown: { src: withBase('/textures/emoji/shutdown.png'), alt: '離線' }
}

const { tooltipRef, tooltip, isMobileView, showTooltip, hideTooltip } = useMcTooltip()
const selectedMenuItem = ref<SelectedMenuItem | null>(null)

watch(isMobileView, (mobile) => {
  if (!mobile) {
    selectedMenuItem.value = null
  }
})

function formatMenuText(text: string): string {
  return formatMinecraftText(text, inlineEmojiMap)
}

function onMenuItemClick(event: MouseEvent, item: SelectedMenuItem) {
  if (!isMobileView.value) return
  if (selectedMenuItem.value?.key !== item.key) {
    event.preventDefault()
    selectedMenuItem.value = item
    return
  }
  if (!item.link) {
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
  padding: 24px 0;
  user-select: none;
}

.mc-menu-container {
  width: 100%;
  max-width: 528px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 核心畫布：使用 176x102 官方材質，以 3 倍像素比 (528x306) 精準呈現 */
.mc-gui-canvas {
  position: relative;
  width: 100%;
  max-width: 528px;
  height: auto;
  aspect-ratio: 176 / 102;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.45));
}

/* 絕對定位的子項目共通樣式 */
.mc-pos-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.mc-pixel-img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  display: block;
}

/* 上半部：左橫幅 (x: 7, y: 17, w: 36, h: 36；內圖 34x34 保留底圖邊框) */
.mc-banner-left {
  left: calc(7 / 176 * 100%);
  top: calc(17 / 102 * 100%);
  width: calc(36 / 176 * 100%);
  height: calc(36 / 102 * 100%);
}

.mc-banner-left-img {
  width: calc(34 / 36 * 100%);
  height: calc(34 / 36 * 100%);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  display: block;
}

/* 上半部：中橫幅 (x: 43, y: 17, w: 90, h: 36；內圖 88x34 保留底圖邊框) */
.mc-banner-main {
  left: calc(43 / 176 * 100%);
  top: calc(17 / 102 * 100%);
  width: calc(90 / 176 * 100%);
  height: calc(36 / 102 * 100%);
}

.mc-banner-main-img {
  width: calc(88 / 90 * 100%);
  height: calc(34 / 36 * 100%);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  display: block;
}

/* 中橫幅疊加按鈕：說明 (?) 與編輯房間配置 (齒輪) */
.mc-banner-guide {
  left: calc(43 / 176 * 100%);
  top: calc(35 / 102 * 100%);
  width: calc(18 / 176 * 100%);
  height: calc(18 / 102 * 100%);
  z-index: 3;
}

.mc-banner-setup {
  left: calc(115 / 176 * 100%);
  top: calc(35 / 102 * 100%);
  width: calc(18 / 176 * 100%);
  height: calc(18 / 102 * 100%);
  z-index: 3;
}

/* 上半部：右側頭像欄 (各 18x18) */
.mc-head {
  width: calc(18 / 176 * 100%);
  height: calc(18 / 102 * 100%);
}
.head-0 {
  left: calc(133 / 176 * 100%);
  top: calc(17 / 102 * 100%);
}
.head-1 {
  left: calc(151 / 176 * 100%);
  top: calc(17 / 102 * 100%);
}

/* 右下合併格：陪玩（測試中）(x: 133, y: 35, w: 36, h: 18) */
.mc-companion {
  left: calc(133 / 176 * 100%);
  top: calc(35 / 102 * 100%);
  width: calc(36 / 176 * 100%);
  height: calc(18 / 102 * 100%);
}

/* 中間：9 格核心物品欄 (y: 53, h: 18, w: 18) */
.mc-slot-item {
  top: calc(53 / 102 * 100%);
  width: calc(18 / 176 * 100%);
  height: calc(18 / 102 * 100%);
}

/* Minecraft 槽位 Hover 光暈遮罩 */
.mc-slot-highlight {
  position: absolute;
  inset: 1px;
  background-color: transparent;
  pointer-events: none;
  z-index: 2;
  transition: background-color 0.08s ease;
}

.mc-pos-item.selected .mc-slot-highlight {
  background-color: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 0 0 2px #ffaa00;
}

.mc-slot-item.is-circle.selected .mc-slot-highlight {
  border-radius: 50%;
}

.mc-bottom-item.selected .mc-slot-highlight {
  border-radius: 3px;
}

@media (hover: hover) {
  .mc-slot-item:hover .mc-slot-highlight,
  .mc-banner-left:hover .mc-slot-highlight,
  .mc-banner-main:hover .mc-slot-highlight,
  .mc-banner-guide:hover .mc-slot-highlight,
  .mc-banner-setup:hover .mc-slot-highlight,
  .mc-head:hover .mc-slot-highlight,
  .mc-companion:hover .mc-slot-highlight {
    background-color: rgba(255, 255, 255, 0.32);
  }
}

.mc-slot-item.is-circle .mc-slot-highlight {
  border-radius: 50%;
}

.mc-slot-img {
  width: calc(16 / 18 * 100%);
  height: calc(16 / 18 * 100%);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  object-fit: contain;
  display: block;
}

/* 底部：9 格資訊與快捷按鈕列 (y: 75, h: 18, w: 18) */
.mc-bottom-item {
  top: calc(75 / 102 * 100%);
  width: calc(18 / 176 * 100%);
  height: calc(18 / 102 * 100%);
}

@media (hover: hover) {
  .mc-bottom-item:hover .mc-slot-highlight {
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 3px;
  }
}

.mc-bottom-img {
  width: calc(16 / 18 * 100%);
  height: calc(16 / 18 * 100%);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  object-fit: contain;
  display: block;
}
</style>
