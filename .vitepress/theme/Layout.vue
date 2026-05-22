<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VersionSelect from './components/VersionSelect.vue'
import UnmaintainedBanner from './components/UnmaintainedBanner.vue'
import LanguageSelect from './components/LanguageSelect.vue'

const { Layout } = DefaultTheme

const route = useRoute()

const unmaintainedVersion = computed(() => {
  const match = route.path.match(/^\/(0\.1|0\.2|0\.3)(\/|$)/)
  return match ? match[1] : null
})

let observer: MutationObserver | null = null

function loadGoogleTranslate() {
  if (typeof window === 'undefined') return
  const w = window as unknown as { __unopimGTLoaded?: boolean }
  if (w.__unopimGTLoaded) return
  w.__unopimGTLoaded = true

  ;(window as any).googleTranslateElementInit = function () {
    const g = (window as any).google
    if (!g || !g.translate || !g.translate.TranslateElement) return
    new g.translate.TranslateElement(
      {
        pageLanguage: 'en',
        autoDisplay: false,
        layout: g.translate.TranslateElement.InlineLayout.HORIZONTAL
      },
      'google_translate_element'
    )
  }

  const s = document.createElement('script')
  s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  s.async = true
  document.head.appendChild(s)
}

function scrollActiveTocIntoView() {
  const active = document.querySelector('.VPDocAsideOutline .outline-link.active')
  if (active && active.scrollIntoView) {
    active.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

onMounted(() => {
  loadGoogleTranslate()
  scrollActiveTocIntoView()
  const toc = document.querySelector('.VPDocAsideOutline')
  if (toc) {
    observer = new MutationObserver(() => {
      scrollActiveTocIntoView()
    })
    observer.observe(toc, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    })
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <UnmaintainedBanner v-if="unmaintainedVersion" :version="unmaintainedVersion" />
    </template>
    <template #nav-bar-content-after>
      <div class="vp-nav-extra notranslate" translate="no">
        <VersionSelect class="vp-version-select" />
        <LanguageSelect />
        <a
          class="vp-github-link"
          href="https://github.com/unopim/unopim"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="UnoPim on GitHub"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </template>
    <template #layout-bottom>
      <div id="google_translate_element" aria-hidden="true" />
    </template>
  </Layout>
</template>

<style scoped>
.vp-nav-extra {
  display: flex;
  align-items: center;
}

.vp-github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 0.75rem;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.vp-github-link:hover {
  color: var(--vp-c-text-1);
}

.vp-github-link svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>