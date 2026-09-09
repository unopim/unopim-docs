<template>
  <div class="custom-block warning unmaintained-banner" role="alert">
    <p class="custom-block-title">This version is no longer maintained</p>
    <p>
      UnoPim <strong>{{ version }}</strong> is unmaintained and no longer receives
      updates or security patches. Please upgrade to the
      <a :href="latestPath">latest version ({{ latestVersion }})</a>.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ version: string }>()

const latestVersion = '3.1'
const latestLanding = '/prologue/'

const latestPath = computed(() => `/${latestVersion}${latestLanding}`)
</script>

<style scoped>
.unmaintained-banner {
  margin: 0 0 24px;
}
</style>
