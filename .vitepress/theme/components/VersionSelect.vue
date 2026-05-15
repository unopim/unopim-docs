<template>
  <div
    v-if="route.path !== '/'"
    class="vp-version-select"
  >
    <select @change="onChange" :value="currentVersion">
      <option v-for="v in versions" :key="v.value" :value="v.value">{{ v.label }}</option>
    </select>
    <span class="vp-version-arrow" aria-hidden="true">▼</span>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vitepress'
import { computed } from 'vue'

const versions = [
  { label: '2.1', value: '2.1' },
  { label: '2.0', value: '2.0' },
  { label: '1.0', value: '1.0' }
]

const route = useRoute()
const router = useRouter()

const currentVersion = computed(() => {
  const match = route.path.match(/^\/(1\.0|2\.0|2\.1)(\/.*)?$/)
  return match ? match[1] : '2.1'
})

const restPath = computed(() => {
  const match = route.path.match(/^\/(1\.0|2\.0|2\.1)(\/.*)?$/)
  return match && match[2] ? match[2] : '/'
})

function onChange(e: Event) {
  const newVersion = (e.target as HTMLSelectElement).value
  const newPath = `/${newVersion}${restPath.value}`
  router.go(newPath)
}
</script>

<style scoped>
.vp-version-select {
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
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
