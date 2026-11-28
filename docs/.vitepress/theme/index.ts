import DefaultTheme from 'vitepress/theme'
import './mc-style.css'
import CatRealmMenu from './components/CatRealmMenu.vue'
import CatRealmFieldGuideMenu from './components/CatRealmFieldGuideMenu.vue'
import CatRealmFieldGuideGrid from './components/CatRealmFieldGuideGrid.vue'
import CatRealmBreakthroughGuide from './components/CatRealmBreakthroughGuide.vue'
import CatRealmIslandGuide from './components/CatRealmIslandGuide.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 註冊全域 Minecraft 元件
    app.component('CatRealmMenu', CatRealmMenu)
    app.component('CatRealmFieldGuideMenu', CatRealmFieldGuideMenu)
    app.component('CatRealmFieldGuideGrid', CatRealmFieldGuideGrid)
    app.component('CatRealmBreakthroughGuide', CatRealmBreakthroughGuide)
    app.component('CatRealmIslandGuide', CatRealmIslandGuide)
  }
} satisfies Theme
