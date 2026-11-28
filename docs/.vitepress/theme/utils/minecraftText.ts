export interface InlineEmojiEntry {
  src: string
  alt: string
}

const COLOR_MAP: Record<string, string> = {
  '0': '#000000',
  '1': '#0000aa',
  '2': '#00aa00',
  '3': '#00aaaa',
  '4': '#aa0000',
  '5': '#aa00aa',
  '6': '#ffaa00',
  '7': '#aaaaaa',
  '8': '#555555',
  '9': '#5555ff',
  'a': '#55ff55',
  'b': '#55ffff',
  'c': '#ff5555',
  'd': '#ff55ff',
  'e': '#ffff55',
  'f': '#ffffff'
}

/**
 * Convert Minecraft formatting codes (&0-&f, &l, &o, &r), newlines,
 * and optional [emojiKey] placeholders into safe HTML.
 */
export function formatMinecraftText(
  text: string,
  inlineEmojiMap?: Record<string, InlineEmojiEntry>
): string {
  if (!text) return ''

  let escaped = text
    .replace(/&(?![0-9a-fk-or])/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  let openSpan = false
  escaped = escaped.replace(/&([0-9a-fk-or])/gi, (_, code: string) => {
    const c = code.toLowerCase()
    const prefix = openSpan ? '</span>' : ''
    if (COLOR_MAP[c]) {
      openSpan = true
      return `${prefix}<span style="color: ${COLOR_MAP[c]}">`
    }
    if (c === 'l') {
      openSpan = true
      return `${prefix}<span style="font-weight: bold">`
    }
    if (c === 'o') {
      openSpan = true
      return `${prefix}<span style="font-style: italic">`
    }
    if (c === 'r') {
      openSpan = true
      return `${prefix}<span style="color: #ffffff">`
    }
    return ''
  })

  if (openSpan) {
    escaped += '</span>'
  }

  if (inlineEmojiMap) {
    const keys = Object.keys(inlineEmojiMap)
    if (keys.length > 0) {
      const escapedKeys = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      const emojiRegex = new RegExp(`\\[(${escapedKeys.join('|')})\\]`, 'g')
      escaped = escaped.replace(emojiRegex, (match, key: string) => {
        const emoji = inlineEmojiMap[key]
        if (!emoji) return match
        return `<img src="${emoji.src}" alt="${emoji.alt}" class="mc-inline-emoji" />`
      })
    }
  }

  escaped = escaped.replace(/\n/g, '<br/>')
  return `<span style="color: #ffffff">${escaped}</span>`
}
