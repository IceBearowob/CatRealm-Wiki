import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

export const MOBILE_MEDIA_QUERY = '(max-width: 640px), (hover: none) and (pointer: coarse)'

export function useMcTooltip() {
  const tooltipRef = ref<HTMLElement | null>(null)
  const isMobileView = ref(false)
  const tooltip = reactive({
    visible: false,
    x: 0,
    y: 0,
    placement: 'top' as 'top' | 'bottom',
    title: '',
    lore: ''
  })

  let mediaQueryList: MediaQueryList | null = null
  let activeCallId = 0

  function hideTooltip() {
    activeCallId++
    tooltip.visible = false
  }

  function updateMobileView() {
    const mobile = mediaQueryList?.matches ?? false
    isMobileView.value = mobile
    if (mobile) {
      hideTooltip()
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    mediaQueryList = window.matchMedia(MOBILE_MEDIA_QUERY)
    updateMobileView()
    mediaQueryList.addEventListener('change', updateMobileView)
  })

  onBeforeUnmount(() => {
    mediaQueryList?.removeEventListener('change', updateMobileView)
    mediaQueryList = null
  })

  async function showTooltip(event: MouseEvent, title: string, lore = '') {
    if (isMobileView.value) return

    const target = event.currentTarget as HTMLElement | null
    if (!target) return

    const callId = ++activeCallId
    const rect = target.getBoundingClientRect()

    tooltip.title = title
    tooltip.lore = lore
    tooltip.placement = 'top'
    tooltip.x = rect.left + rect.width / 2
    tooltip.y = rect.top - 8
    tooltip.visible = true

    await nextTick()

    if (callId !== activeCallId || !tooltip.visible || typeof window === 'undefined') return
    const tipEl = tooltipRef.value
    if (!tipEl) return

    const tipRect = tipEl.getBoundingClientRect()
    const margin = 12
    const halfWidth = tipRect.width / 2
    const minX = margin + halfWidth
    const maxX = window.innerWidth - margin - halfWidth

    if (minX > maxX) {
      tooltip.x = window.innerWidth / 2
    } else {
      tooltip.x = Math.min(Math.max(rect.left + rect.width / 2, minX), maxX)
    }

    if (rect.top - 8 - tipRect.height < 68 && rect.bottom + 8 + tipRect.height <= window.innerHeight - margin) {
      tooltip.placement = 'bottom'
      tooltip.y = rect.bottom + 8
    } else {
      tooltip.placement = 'top'
      tooltip.y = rect.top - 8
    }
  }

  return {
    tooltipRef,
    tooltip,
    isMobileView,
    showTooltip,
    hideTooltip
  }
}
