<template>
  <div
    v-if="route.path !== '/'"
    class="vp-version-select"
  >
    <select @change="onChange">
      <option
        v-for="v in versions"
        :key="v.value"
        :value="v.value"
        :selected="v.value === currentVersion"
      >{{ v.label }}</option>
    </select>
    <span class="vp-version-arrow" aria-hidden="true">▼</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vitepress'
import { computed } from 'vue'
import { data as pages } from '../pages.data.mjs'

const LATEST = '3.1'
const VERSION_PATH = /^\/(\d+\.\d+)(\/.*)?$/

const versions = [
  { label: 'master', value: 'master' },
  { label: '3.1', value: '3.1' },
  { label: '3.0', value: '3.0' },
  { label: '2.1', value: '2.1' },
  { label: '2.0', value: '2.0' },
  { label: '1.0', value: '1.0' },
  { label: '0.3', value: '0.3' },
  { label: '0.2', value: '0.2' },
  { label: '0.1', value: '0.1' }
]

const route = useRoute()
const router = useRouter()

const knownPages = new Set(pages)

const match = computed(() => route.path.match(VERSION_PATH))

const currentVersion = computed(() => match.value ? match.value[1] : LATEST)

const restPath = computed(() => match.value && match.value[2] ? match.value[2] : '/')

function exists(path: string) {
  return knownPages.has(path) || knownPages.has(path.replace(/\.html$/, ''))
}

/**
 * The same page in another version, or that version's landing page when the
 * page does not exist there — switching versions must never land on a 404.
 */
function resolveTarget(version: string) {
  const candidate = `/${version}${restPath.value}`

  if (restPath.value !== '/' && exists(candidate)) {
    return candidate
  }

  const landing = `/${version}/prologue/`

  if (exists(landing)) {
    return landing
  }

  return pages.find((url) => url.startsWith(`/${version}/`)) ?? landing
}

function onChange(e: Event) {
  const selected = (e.target as HTMLSelectElement).value
  // 'master' is an alias that always sends users to the latest version.
  router.go(resolveTarget(selected === 'master' ? LATEST : selected))
}
</script>

<style scoped>
.vp-version-select {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.vp-version-select select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  border: 1px solid var(--vp-c-border, #e1e1e1);
  border-radius: 6px;
  padding: 0.25rem 2rem 0.25rem 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  height: 2rem;
  box-shadow: 0 1px 2px rgba(60,60,60,0.03);
  transition: border-color 0.2s;
  outline: none;
}

.vp-version-select select:focus {
  border-color: var(--vp-c-brand, #8b5cf6);
}

.vp-version-arrow {
  pointer-events: none;
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-2, #888);
  font-size: 0.85em;
}
</style>
