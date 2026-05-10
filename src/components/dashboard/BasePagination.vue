<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: { type: Number, required: true },   // 1-based
  totalPages:  { type: Number, required: true },
  totalElements: { type: Number, default: 0 },
  itemsPerPage:  { type: Number, default: 10 },
  visibleCount:  { type: Number, default: 5 },      // max page raqamlar soni
})

const emit = defineEmits(['page-change'])

// Qancha element ko'rsatilayotganini hisoblash
const rangeText = computed(() => {
  if (props.totalElements === 0) return '0'
  const from = (props.currentPage - 1) * props.itemsPerPage + 1
  const to   = Math.min(props.currentPage * props.itemsPerPage, props.totalElements)
  return `${from}–${to} / ${props.totalElements}`
})

// Smart pages: [1, '...', 4, 5, 6, '...', 12]
const pages = computed(() => {
  const total = props.totalPages
  const cur   = props.currentPage
  if (total <= props.visibleCount + 2) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const result = []
  const half   = Math.floor(props.visibleCount / 2)
  let start    = Math.max(2, cur - half)
  let end      = Math.min(total - 1, cur + half)

  if (cur - half <= 2) end = Math.min(total - 1, props.visibleCount)
  if (cur + half >= total - 1) start = Math.max(2, total - props.visibleCount + 1)

  result.push(1)
  if (start > 2) result.push('...')
  for (let i = start; i <= end; i++) result.push(i)
  if (end < total - 1) result.push('...')
  result.push(total)
  return result
})

const goTo = (page) => {
  if (typeof page !== 'number') return
  if (page < 1 || page > props.totalPages) return
  if (page === props.currentPage) return
  emit('page-change', page)
}
</script>

<template>
  <div class="base-pagination" v-if="totalPages > 0">
    <span class="bp-range">{{ rangeText }}</span>

    <div class="bp-controls">
      <!-- Prev -->
      <button
        class="bp-btn bp-btn-nav"
        :disabled="currentPage === 1"
        @click="goTo(currentPage - 1)"
        aria-label="Oldingi"
      >
        <ChevronLeft :size="15" />
      </button>

      <!-- Pages -->
      <template v-for="(page, i) in pages" :key="i">
        <span v-if="page === '...'" class="bp-dots">…</span>
        <button
          v-else
          class="bp-btn bp-btn-page"
          :class="{ 'bp-btn-active': page === currentPage }"
          :aria-label="`${page}-sahifa`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        class="bp-btn bp-btn-nav"
        :disabled="currentPage === totalPages"
        @click="goTo(currentPage + 1)"
        aria-label="Keyingi"
      >
        <ChevronRight :size="15" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.base-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.bp-range {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.bp-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bp-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 6px;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
  font-family: inherit;
}

.bp-btn:hover:not(:disabled):not(.bp-btn-active) {
  border-color: #007bff;
  color: #007bff;
  background: rgba(0,123,255,0.05);
}

.bp-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bp-btn-active {
  background: #007bff;
  border-color: #007bff;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,123,255,0.3);
}

.bp-btn-nav {
  color: #64748b;
}

.bp-dots {
  width: 28px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
  user-select: none;
}

@media (max-width: 480px) {
  .base-pagination {
    justify-content: center;
  }
  .bp-range {
    display: none;
  }
}
</style>
