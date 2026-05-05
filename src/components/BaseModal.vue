<script setup>
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title:      { type: String, default: '' },
  subtitle:   { type: String, default: '' },
  size:       { type: String, default: 'md' }, // sm | md | lg
  closable:   { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  if (!props.closable) return
  emit('update:modelValue', false)
  emit('close')
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="bm-fade">
      <div v-if="modelValue" class="bm-overlay" @click.self="close" role="dialog" aria-modal="true">
        <Transition name="bm-slide">
          <div v-if="modelValue" class="bm-panel" :class="`bm-panel--${size}`">
            <!-- Header -->
            <div class="bm-header" v-if="$slots.icon || title || subtitle || closable">
              <div class="bm-header-left">
                <div class="bm-icon-wrap" v-if="$slots.icon">
                  <slot name="icon" />
                </div>
                <div class="bm-header-text" v-if="title || subtitle">
                  <h2 class="bm-title">{{ title }}</h2>
                  <p class="bm-subtitle" v-if="subtitle">{{ subtitle }}</p>
                </div>
              </div>
              <button v-if="closable" class="bm-close" @click="close" aria-label="Yopish">
                <X :size="16" />
              </button>
            </div>

            <!-- Body -->
            <div class="bm-body">
              <slot />
            </div>

            <!-- Footer -->
            <div class="bm-footer" v-if="$slots.footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.bm-panel {
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 4px 6px -1px rgba(0,0,0,0.07),
    0 24px 48px -8px rgba(0,0,0,0.16);
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bm-panel--sm { max-width: 400px; }
.bm-panel--md { max-width: 520px; }
.bm-panel--lg { max-width: 720px; }

/* Header */
.bm-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.bm-header-left {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.bm-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.15);
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bm-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bm-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.bm-subtitle {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.4;
}

.bm-close {
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 7px;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bm-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Body */
.bm-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.bm-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Transitions */
.bm-fade-enter-active,
.bm-fade-leave-active {
  transition: opacity 0.22s ease;
}
.bm-fade-enter-from,
.bm-fade-leave-to {
  opacity: 0;
}

.bm-slide-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.bm-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.bm-slide-enter-from {
  opacity: 0;
  transform: scale(0.94) translateY(12px);
}
.bm-slide-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(6px);
}

@media (max-width: 520px) {
  .bm-overlay {
    align-items: flex-end;
    padding: 0;
  }
  .bm-panel {
    border-radius: 20px 20px 0 0;
    max-height: 90vh;
    max-width: 100%;
  }
  .bm-slide-enter-from {
    opacity: 0;
    transform: translateY(40px);
  }
}
</style>
