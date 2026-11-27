import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: process.env.BASE_PATH || '/CatRealm-Wiki/',
  title: "貓域 Wiki",
  description: "貓域伺服器 (CatRealm) 非官方百科",
  lang: "zh-TW",
  // 暫時屏蔽尚未開放的頁面（保留原檔供後續開發）
  srcExclude: [
    'gui/**',
    'guide/creature.md',
    'guide/material.md',
    'guide/recipe.md',
    'guide/accessory.md',
    'guide/plush.md',
    'guide/island.md'
  ],
  themeConfig: {
    // 頂部導覽列（暫時隱藏）
    // nav: [
    //   { text: '🖥️ 主選單', link: '/gui/main-menu' },
    //   { text: '📖 圖鑑', link: '/guide/index' }
    //   // 尚未實作的頁面暫時屏蔽
    //   // { text: '⚙️ 機制', link: '/mechanics/land' },
    //   // { text: '🛠️ 功能', link: '/features/commands' },
    //   // { text: '📦 物品', link: '/items/custom-items' }
    // ],

    // 左側側邊欄（暫時僅顯示已實作頁面）
    sidebar: [
      // 選單頁面暫時屏蔽
      // {
      //   text: '🖥️ GUI 選單',
      //   collapsed: false,
      //   items: [
      //     { text: '主功能選單', link: '/gui/main-menu' },
      //     { text: '傳送導航選單', link: '/gui/warp-menu' },
      //     { text: '伺服器設定選單', link: '/gui/settings-menu' }
      //   ]
      // },
      {
        text: '📖 圖鑑',
        collapsed: false,
        items: [
          { text: '圖鑑系統總覽', link: '/guide/index' },
          { text: '突破圖鑑', link: '/guide/enchant' }
          // { text: '生物圖鑑', link: '/guide/creature' },
          // { text: '素材圖鑑', link: '/guide/material' },
          // { text: '食譜圖鑑', link: '/guide/recipe' },
          // { text: '飾品圖鑑', link: '/guide/accessory' },
          // { text: '玩偶圖鑑', link: '/guide/plush' },
          // { text: '空島圖鑑', link: '/guide/island' }
        ]
      }
      // 尚未實作的分類暫時屏蔽
      // {
      //   text: '⚙️ 機制',
      //   collapsed: false,
      //   items: [
      //     { text: '領地與保護機制', link: '/mechanics/land' },
      //     { text: '經濟、交易與稅率', link: '/mechanics/economy' },
      //     { text: '公會與陣營機制', link: '/mechanics/guilds' },
      //     { text: '副本與戰鬥機制', link: '/mechanics/dungeons' }
      //   ]
      // },
      // {
      //   text: '🛠️ 功能',
      //   collapsed: false,
      //   items: [
      //     { text: '常用指令大全', link: '/features/commands' },
      //     { text: '拍賣行使用說明', link: '/features/auction' },
      //     { text: '稱號與快捷功能', link: '/features/features' }
      //   ]
      // },
      // {
      //   text: '📦 物品',
      //   collapsed: false,
      //   items: [
      //     { text: '自訂道具一覽', link: '/items/custom-items' },
      //     { text: '消耗品與特殊藥水', link: '/items/consumables' },
      //     { text: '特殊合成配方表', link: '/items/crafting' }
      //   ]
      // }
    ],

    // 本地全文搜尋
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜尋文件',
                buttonAriaLabel: '搜尋文件'
              },
              modal: {
                noResultsText: '找不到相關結果',
                resetButtonTitle: '清除查詢條件',
                footer: {
                  selectText: '選擇',
                  navigateText: '切換',
                  closeText: '關閉'
                }
              }
            }
          }
        }
      }
    },

    // 社交連結
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],

    // 頁尾設定
    footer: {
      message: '這是貓域非官方Wiki',
      copyright: 'Copyright © 2026 CatRealm Wiki'
    },

    // 繁體中文本地化介面文字
    outline: {
      label: '本頁目錄'
    },
    docFooter: {
      prev: false,
      next: false
    },
    darkModeSwitchLabel: '外觀主題',
    lightModeSwitchTitle: '切換為淺色模式',
    darkModeSwitchTitle: '切換為深色模式',
    sidebarMenuLabel: '選單',
    returnToTopLabel: '返回頂部'
  }
})
