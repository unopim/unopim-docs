<template>
  <div class="lang-switch notranslate" translate="no" ref="rootRef">
    <button
      type="button"
      class="lang-switch__btn"
      :class="{ 'is-open': open }"
      :aria-label="`Translate page${currentLang ? ` (currently ${currentLang.label})` : ''}`"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <svg class="lang-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
        />
      </svg>
      <span class="lang-switch__label">{{ currentLang ? currentLang.label : 'Translate' }}</span>
      <svg class="lang-switch__chevron" viewBox="0 0 12 12" aria-hidden="true">
        <path fill="currentColor" d="M2.5 4.5l3.5 3.5 3.5-3.5z" />
      </svg>
    </button>

    <Transition name="lang-pop">
      <div
        v-if="open"
        class="lang-switch__menu"
        role="listbox"
        aria-label="Language"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          type="button"
          role="option"
          class="lang-switch__item"
          :class="{ 'is-active': isActive(lang.code) }"
          :aria-selected="isActive(lang.code)"
          @click="select(lang.code)"
        >
          <span class="lang-switch__item-name">{{ lang.label }}</span>
          <span class="lang-switch__item-native">{{ lang.native }}</span>
          <span v-if="isActive(lang.code)" class="lang-switch__check" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path fill="currentColor" d="M6.2 11.2L2.6 7.6l1.2-1.2 2.4 2.4 5.6-5.6L13 4.4z" />
            </svg>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

type Language = { code: string; label: string; native: string }

const languages: Language[] = [
  { code: 'en',    label: 'English',    native: 'English' },
  { code: 'es',    label: 'Spanish',    native: 'Español' },
  { code: 'fr',    label: 'French',     native: 'Français' },
  { code: 'de',    label: 'German',     native: 'Deutsch' },
  { code: 'nl_NL', label: 'Dutch',     native: 'Dutch' },
  { code: 'zh-CN', label: 'Chinese',    native: '中文' },
  { code: 'ja',    label: 'Japanese',    native: '日本語' },
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

function onDocClick(e: MouseEvent) {
  if (!open.value) return
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) close()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close()
}

onMounted(() => {
  activeCode.value = readCookieLang()
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.lang-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.75rem;
}

.lang-switch__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2rem;
  padding: 0 0.6rem 0 0.55rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
}

.lang-switch__btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1, var(--vp-c-brand));
}

.lang-switch__btn:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1, var(--vp-c-brand));
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft, rgba(139, 92, 246, 0.18));
}

.lang-switch__btn.is-open {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1, var(--vp-c-brand));
}

.lang-switch__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.lang-switch__label {
  line-height: 1;
  white-space: nowrap;
}

.lang-switch__chevron {
  width: 10px;
  height: 10px;
  opacity: 0.7;
  transition: transform 0.2s;
}

.lang-switch__btn.is-open .lang-switch__chevron {
  transform: rotate(180deg);
}

.lang-switch__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 60;
  min-width: 200px;
  padding: 6px;
  background: var(--vp-c-bg-elv, var(--vp-c-bg));
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.08);
  max-height: 320px;
  overflow-y: auto;
}

.lang-switch__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.45rem 0.6rem;
  font-size: 0.88rem;
  text-align: left;
  color: var(--vp-c-text-1);
  background: transparent;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.lang-switch__item:hover {
  background: var(--vp-c-default-soft, var(--vp-c-bg-soft));
  color: var(--vp-c-text-1);
}

.lang-switch__item.is-active {
  color: var(--vp-c-brand-1, var(--vp-c-brand));
  background: var(--vp-c-brand-soft, rgba(139, 92, 246, 0.12));
}

.lang-switch__item-name {
  font-weight: 500;
}

.lang-switch__item-native {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--vp-c-text-3, var(--vp-c-text-2));
  opacity: 0.9;
}

.lang-switch__item.is-active .lang-switch__item-native {
  color: inherit;
  opacity: 0.85;
}

.lang-switch__check {
  display: inline-flex;
  margin-left: 0.35rem;
}
.lang-switch__check svg {
  width: 14px;
  height: 14px;
}

.lang-pop-enter-active,
.lang-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lang-pop-enter-from,
.lang-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

@media (max-width: 768px) {
  .lang-switch__label {
    display: none;
  }
  .lang-switch__btn {
    padding: 0 0.5rem;
    gap: 0.3rem;
  }
  .lang-switch__menu {
    right: -8px;
  }
}
</style>
