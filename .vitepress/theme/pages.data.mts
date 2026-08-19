import { createContentLoader } from 'vitepress'

/**
 * Every documented page URL, used by the version switcher to fall back to a
 * version's landing page instead of navigating to a path that version lacks.
 */
export default createContentLoader('*/**/*.md', {
  transform: (raw) => raw.map(({ url }) => url)
})
