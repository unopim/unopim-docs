<template>
  <div
    class="lang-switch notranslate"
    translate="no"
    ref="rootRef"
    v-click-outside="close"
    @mouseenter="onHoverOpen"
    @mouseleave="onHoverClose"
  >
    <button
      type="button"
      class="lang-switch__btn"
      :class="{ 'is-open': open }"
      :aria-label="`Translate page${currentLang ? ` (currently ${currentLang.label})` : ''}`"
      :aria-expanded="open"
      aria-haspopup="listbox"
      title="Translate this page"
      @click="toggle"
      @focus="onHoverOpen"
      @keydown.escape="close"
    >
      <svg class="lang-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
        />
      </svg>
    </button>

    <Transition name="lang-pop">
      <div
        v-if="open"
        class="lang-switch__menu notranslate"
        translate="no"
        role="listbox"
        aria-label="Language"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          type="button"
          role="option"
          class="lang-switch__item notranslate"
          translate="no"
          :class="{ 'is-active': isActive(lang.code) }"
          :aria-selected="isActive(lang.code)"
          @click="select(lang.code)"
        >
          <span class="lang-switch__item-flag" aria-hidden="true">{{ lang.flag }}</span>
          <span class="lang-switch__item-name">{{ lang.label }}</span>
          <span v-if="isActive(lang.code)" class="lang-switch__check" aria-hidden="true">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type Language = { code: string; label: string; native: string; flag: string }

const languages: Language[] = [
  { code: 'en', label: 'English', native: 'English',    flag: '🇺🇸' },
  { code: 'de', label: 'German',  native: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'French',  native: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', native: 'Español',    flag: '🇪🇸' },
  { code: 'nl', label: 'Dutch',   native: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polish',  native: 'Polski',     flag: '🇵🇱' },
]

const SOURCE_LANG = 'en'
const COOKIE = 'googtrans'

const open = ref(false)
const activeCode = ref<string>(SOURCE_LANG)
const rootRef = ref<HTMLElement | null>(null)

const currentLang = computed(() =>
  languages.find(l => l.code === activeCode.value) || languages[0]
)

function isActive(code: string) {
  return activeCode.value === code
}

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function readCookieLang(): string {
  if (typeof document === 'undefined') return SOURCE_LANG
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/)
  if (!m) return SOURCE_LANG
  const value = decodeURIComponent(m[1])
  const parts = value.split('/').filter(Boolean)
  return parts[parts.length - 1] || SOURCE_LANG
}

function writeCookie(code: string) {
  const value = code === SOURCE_LANG ? '' : `/${SOURCE_LANG}/${code}`
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)
  const base = `${COOKIE}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}`
  document.cookie = base
  if (typeof location !== 'undefined' && location.hostname) {
    document.cookie = `${base}; domain=${location.hostname}`
    const root = location.hostname.replace(/^[^.]+\./, '')
    if (root && root !== location.hostname && root.includes('.')) {
      document.cookie = `${base}; domain=.${root}`
    }
  }
}

function clearCookie() {
  const expired = `Thu, 01 Jan 1970 00:00:00 GMT`
  document.cookie = `${COOKIE}=; path=/; expires=${expired}`
  if (typeof location !== 'undefined' && location.hostname) {
    document.cookie = `${COOKIE}=; path=/; expires=${expired}; domain=${location.hostname}`
    const root = location.hostname.replace(/^[^.]+\./, '')
    if (root && root !== location.hostname && root.includes('.')) {
      document.cookie = `${COOKIE}=; path=/; expires=${expired}; domain=.${root}`
    }
  }
}

function triggerCombo(code: string): boolean {
  const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
  if (!combo) return false
  combo.value = code === SOURCE_LANG ? '' : code
  combo.dispatchEvent(new Event('change'))
  return true
}

function select(code: string) {
  activeCode.value = code
  close()

  if (code === SOURCE_LANG) {
    clearCookie()
    if (!triggerCombo(SOURCE_LANG)) {
      location.reload()
    } else {
      setTimeout(() => location.reload(), 50)
    }
    return
  }

  writeCookie(code)
  if (!triggerCombo(code)) {
    location.reload()
  }
}

// Hover support: opens on mouseenter, closes after a short delay on
// mouseleave so the cursor can travel from trigger to menu without it
// snapping shut.
let closeTimer: ReturnType<typeof setTimeout> | null = null

function onHoverOpen() {
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  if (!open.value) open.value = true
}

function onHoverClose() {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    open.value = false
    closeTimer = null
  }, 180)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close()
}

onMounted(() => {
  activeCode.value = readCookieLang()
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
})

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    ;(el as any).__vco = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', (el as any).__vco)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any).__vco)
  }
}
</script>

<style scoped>
.lang-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* Trigger — circular icon button, matches VPSocialLink sizing */
.lang-switch__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s;
}

.lang-switch__btn:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.lang-switch__btn:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

.lang-switch__btn.is-open,
.lang-switch__btn[aria-expanded="true"] {
  color: var(--vp-c-brand);
  background-color: var(--vp-c-default-soft);
}

.lang-switch__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Menu — mirrors .VPMenu styling from VitePress default theme */
.lang-switch__menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 50;
  min-width: 180px;
  padding: 8px;
  background: var(--vp-c-bg-elv, var(--vp-c-bg));
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 360px;
  overflow-y: auto;
}

.lang-switch__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  background: transparent;
  border-radius: 6px;
  font-family: inherit;
  color: var(--vp-c-text-1);
  text-align: left;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.lang-switch__item-flag {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji",
    "Twemoji Mozilla", sans-serif;
}

.lang-switch__item-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

.lang-switch__check {
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: var(--vp-c-brand);
  flex-shrink: 0;
}

.lang-switch__item:hover {
  color: var(--vp-c-brand);
  background-color: var(--vp-c-default-soft);
}

.lang-switch__item.is-active {
  background: linear-gradient(
    135deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-dark, #6b46c1) 100%
  );
  color: #fff;
}

.lang-switch__item.is-active .lang-switch__item-name {
  color: #fff;
  font-weight: 600;
}

.lang-switch__item.is-active .lang-switch__check {
  color: #fff;
}

.lang-switch__item.is-active:hover {
  background: linear-gradient(
    135deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-dark, #6b46c1) 100%
  );
  color: #fff;
  filter: brightness(1.05);
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .lang-switch__menu {
    right: -8px;
  }
}
</style>
