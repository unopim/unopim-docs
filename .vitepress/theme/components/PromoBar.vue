<template>
  <div v-if="visible" class="unopim-promo-bar" role="region" aria-label="Promotion">
    <div class="unopim-promo-inner">
      <div class="unopim-promo-lead">
        <span class="unopim-promo-icon" aria-hidden="true" v-html="icon" />

        <span class="unopim-promo-tag">{{ tag }}</span>

        <span class="unopim-promo-message" v-html="message" />
      </div>

      <div class="unopim-promo-actions">
        <a
          class="unopim-promo-cta"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ cta }}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14 M13 6l6 6-6 6" />
          </svg>
        </a>

        <button
          type="button"
          class="unopim-promo-close"
          aria-label="Dismiss"
          @click="dismiss"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18 M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Mirrors the admin "cloud" promo banner (config/help.php + lang/en_US/app.php).
const STORAGE_KEY = 'unopim-docs-promo-cloud-dismissed'
const BAR_HEIGHT = '48px'

const tag = 'Cloud Hosting'
const message =
  'Launch UnoPim on fully-managed cloud hosting — <b>fast, secure and cost-effective plans.</b>'
const cta = 'View plans'
const url = 'https://unopim.com/cloud-hosting/'
const icon =
  '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 9.1 4 4 0 0 0 6.5 19z"></path></svg>'

const visible = ref(true)

function setTopHeight(value: string) {
  document.documentElement.style.setProperty('--vp-layout-top-height', value)
}

function dismiss() {
  visible.value = false
  setTopHeight('0px')
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore storage errors (private mode, etc.) */
  }
}

onMounted(() => {
  let dismissed = false
  try {
    dismissed = localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    dismissed = false
  }

  if (dismissed) {
    visible.value = false
    setTopHeight('0px')
  } else {
    setTopHeight(BAR_HEIGHT)
  }
})
</script>

<style scoped>
.unopim-promo-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  z-index: var(--vp-z-index-layout-top);
  background: linear-gradient(to right, #5b41d6, #8367f0);
  color: #fff;
  overflow: hidden;
}

.unopim-promo-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 20px;
  font-size: 13.5px;
}

.unopim-promo-lead {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.unopim-promo-icon {
  display: inline-flex;
  flex-shrink: 0;
}

.unopim-promo-tag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 9px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.unopim-promo-message {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.unopim-promo-message :deep(b) {
  font-weight: 700;
}

.unopim-promo-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.unopim-promo-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
  background: #fff;
  color: #5b41d6;
  transition: transform 0.15s, box-shadow 0.15s;
}

.unopim-promo-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.unopim-promo-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background: transparent;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.15s, background-color 0.15s;
}

.unopim-promo-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 640px) {
  .unopim-promo-tag {
    display: none;
  }
}
</style>
