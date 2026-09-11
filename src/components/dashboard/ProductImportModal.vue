<script setup>
import { ref, computed, watch } from 'vue'
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
} from 'lucide-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useProductImport } from '@/composables/useProductImport'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  /** Do'kondagi kategoriyalar — fayldagi categoryName shu ro'yxatdan bo'lishi kerak */
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'imported'])

const {
  file,
  templateLoading,
  checking,
  importing,
  busy,
  result,
  rowErrors,
  fatalMessage,
  hasErrors,
  canConfirm,
  acceptAttribute,
  setFile,
  reset,
  downloadTemplate,
  check,
  confirmImport,
} = useProductImport()

const fileInput = ref(null)
const isDragging = ref(false)

/** Import tugagach modal "yakun" holatiga o'tadi */
const isDone = computed(() => !!result.value && !result.value.dryRun)

const realCategories = computed(() => props.categories.filter((c) => c.id !== 'All'))

const close = () => {
  if (busy.value) return
  emit('update:modelValue', false)
}

// Har ochilganda toza holatdan boshlanadi
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      reset()
      isDragging.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  },
)

const onPick = (e) => setFile(e.target.files?.[0] ?? null)

const onDrop = (e) => {
  isDragging.value = false
  setFile(e.dataTransfer?.files?.[0] ?? null)
}

const clearFile = () => {
  setFile(null)
  if (fileInput.value) fileInput.value.value = ''
}

const onConfirm = async () => {
  const ok = await confirmImport()
  if (ok) emit('imported')
}

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    size="lg"
    :closable="!busy"
    :title="$t('dashboard.products.import.title')"
    :subtitle="$t('dashboard.products.import.subtitle')"
    @update:model-value="close"
  >
    <template #icon><Upload :size="20" /></template>

    <!-- ─── Yakuniy holat ──────────────────────── -->
    <div v-if="isDone" class="pi-done">
      <div class="pi-done-icon"><CheckCircle2 :size="28" /></div>
      <h3 class="pi-done-title">{{ $t('dashboard.products.import.success_title') }}</h3>
      <p class="pi-done-text">
        {{ $t('dashboard.products.import.success_text', { count: result.imported }) }}
      </p>
    </div>

    <!-- ─── Ish holati ─────────────────────────── -->
    <template v-else>
      <!-- 1-qadam: shablon -->
      <div class="pi-step">
        <span class="pi-step-num">1</span>
        <div class="pi-step-body">
          <p class="pi-step-text">{{ $t('dashboard.products.import.template_hint') }}</p>
          <button
            type="button"
            class="pi-btn-outline"
            :disabled="templateLoading"
            @click="downloadTemplate"
          >
            <Loader2 v-if="templateLoading" :size="15" class="pi-spin" />
            <Download v-else :size="15" />
            {{
              templateLoading
                ? $t('dashboard.products.import.downloading')
                : $t('dashboard.products.import.template_btn')
            }}
          </button>
        </div>
      </div>

      <!-- 2-qadam: fayl -->
      <div class="pi-step">
        <span class="pi-step-num">2</span>
        <div class="pi-step-body">
          <!-- Tanlangan fayl -->
          <div v-if="file" class="pi-file">
            <span class="pi-file-icon"><FileSpreadsheet :size="18" /></span>
            <span class="pi-file-info">
              <strong class="pi-file-name">{{ file.name }}</strong>
              <span class="pi-file-size">{{ formatSize(file.size) }}</span>
            </span>
            <button
              type="button"
              class="pi-file-clear"
              :disabled="busy"
              :aria-label="$t('dashboard.products.import.change_file')"
              @click="clearFile"
            >
              <X :size="15" />
            </button>
          </div>

          <!-- Tashlash maydoni -->
          <div
            v-else
            class="pi-drop"
            :class="{ 'is-dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <span class="pi-drop-icon"><Upload :size="20" /></span>
            <p class="pi-drop-title">{{ $t('dashboard.products.import.drop_title') }}</p>
            <span class="pi-drop-or">{{ $t('dashboard.products.import.drop_or') }}</span>
            <button type="button" class="pi-btn-outline" @click="fileInput?.click()">
              {{ $t('dashboard.products.import.browse') }}
            </button>
            <span class="pi-drop-formats">{{ $t('dashboard.products.import.formats') }}</span>
          </div>

          <input
            ref="fileInput"
            type="file"
            class="pi-input-hidden"
            :accept="acceptAttribute"
            @change="onPick"
          />

          <!-- Kategoriyalar eslatmasi -->
          <div v-if="realCategories.length" class="pi-cats">
            <p class="pi-cats-note">{{ $t('dashboard.products.import.categories_note') }}</p>
            <span class="pi-cats-label">{{
              $t('dashboard.products.import.categories_available')
            }}</span>
            <div class="pi-cats-list">
              <span v-for="c in realCategories" :key="c.id" class="pi-cat">{{ c.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tekshiruv natijasi -->
      <div v-if="result?.dryRun && !hasErrors" class="pi-alert pi-alert--ok">
        <CheckCircle2 :size="18" />
        <div>
          <strong>{{ $t('dashboard.products.import.valid_title') }}</strong>
          <p>{{ $t('dashboard.products.import.valid_text', { count: result.totalRows }) }}</p>
        </div>
      </div>

      <!-- Umumiy xato (qatorlarsiz) -->
      <div v-if="fatalMessage && !rowErrors.length" class="pi-alert pi-alert--err">
        <AlertTriangle :size="18" />
        <p>{{ fatalMessage }}</p>
      </div>

      <!-- Xato qatorlar jadvali -->
      <div v-if="rowErrors.length" class="pi-errors">
        <div class="pi-errors-head">
          <span class="pi-errors-title">
            <AlertTriangle :size="16" />
            {{ $t('dashboard.products.import.errors_title') }}
          </span>
          <span class="pi-errors-badge">
            {{ $t('dashboard.products.import.errors_count', { count: rowErrors.length }) }}
          </span>
        </div>
        <p class="pi-errors-text">
          {{ fatalMessage || $t('dashboard.products.import.errors_text') }}
        </p>

        <div class="pi-table-wrap">
          <table class="pi-table">
            <thead>
              <tr>
                <th class="pi-th-row">{{ $t('dashboard.products.import.col_row') }}</th>
                <th class="pi-th-col">{{ $t('dashboard.products.import.col_column') }}</th>
                <th>{{ $t('dashboard.products.import.col_message') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in rowErrors" :key="e.key">
                <td class="pi-td-row">{{ e.row ?? '—' }}</td>
                <td>
                  <code class="pi-code">{{ e.column }}</code>
                </td>
                <td class="pi-td-msg">{{ e.message }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- ─── Footer ─────────────────────────────── -->
    <template #footer>
      <template v-if="isDone">
        <button type="button" class="pi-btn-primary" @click="close">
          {{ $t('dashboard.products.import.done') }}
        </button>
      </template>
      <template v-else>
        <button type="button" class="pi-btn-ghost" :disabled="busy" @click="close">
          {{ $t('dashboard.products.import.cancel') }}
        </button>
        <button
          v-if="!canConfirm"
          type="button"
          class="pi-btn-primary"
          :disabled="!file || busy"
          @click="check"
        >
          <Loader2 v-if="checking" :size="15" class="pi-spin" />
          {{
            checking
              ? $t('dashboard.products.import.checking')
              : $t('dashboard.products.import.check_btn')
          }}
        </button>
        <button v-else type="button" class="pi-btn-primary" :disabled="busy" @click="onConfirm">
          <Loader2 v-if="importing" :size="15" class="pi-spin" />
          {{
            importing
              ? $t('dashboard.products.import.importing')
              : $t('dashboard.products.import.confirm_btn')
          }}
        </button>
      </template>
    </template>
  </BaseModal>
</template>

<style scoped>
/* ─── Qadamlar ───────────────────────────────── */
.pi-step {
  display: flex;
  gap: 0.85rem;
  padding-bottom: 1.15rem;
  margin-bottom: 1.15rem;
  border-bottom: 1px solid #f1f5f9;
}

.pi-step:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.pi-step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.pi-step-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.pi-step-text {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.6;
}

/* ─── Tashlash maydoni ───────────────────────── */
.pi-drop {
  width: 100%;
  border: 1.5px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: all 0.2s ease;
}

.pi-drop.is-dragging {
  border-color: #007bff;
  background: rgba(0, 123, 255, 0.05);
}

.pi-drop-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pi-drop-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.pi-drop-or,
.pi-drop-formats {
  font-size: 0.75rem;
  color: #94a3b8;
}

.pi-input-hidden {
  display: none;
}

/* ─── Tanlangan fayl ─────────────────────────── */
.pi-file {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.pi-file-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pi-file-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.pi-file-name {
  font-size: 0.85rem;
  color: #0f172a;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pi-file-size {
  font-size: 0.72rem;
  color: #94a3b8;
}

.pi-file-clear {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.pi-file-clear:hover:not(:disabled) {
  background: #cbd5e1;
  color: #0f172a;
}

/* ─── Kategoriyalar ──────────────────────────── */
.pi-cats {
  width: 100%;
  padding: 0.85rem 0.9rem;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.18);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pi-cats-note {
  margin: 0;
  font-size: 0.8rem;
  color: #92400e;
  line-height: 1.55;
}

.pi-cats-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #b45309;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pi-cats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.pi-cat {
  padding: 2px 9px;
  border-radius: 100px;
  background: #fff;
  border: 1px solid rgba(245, 158, 11, 0.25);
  font-size: 0.72rem;
  color: #92400e;
  font-weight: 500;
}

/* ─── Bildirishlar ───────────────────────────── */
.pi-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  margin-top: 1.15rem;
  font-size: 0.85rem;
  line-height: 1.55;
}

.pi-alert p {
  margin: 2px 0 0;
}

.pi-alert--ok {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.22);
  color: #065f46;
}

.pi-alert--err {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

/* ─── Xatolar jadvali ────────────────────────── */
.pi-errors {
  margin-top: 1.15rem;
  border: 1px solid #fecaca;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.pi-errors-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
}

.pi-errors-title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #b91c1c;
}

.pi-errors-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #dc2626;
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 100px;
  padding: 2px 10px;
  white-space: nowrap;
}

.pi-errors-text {
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.6;
  border-bottom: 1px solid #f1f5f9;
}

.pi-table-wrap {
  max-height: 260px;
  overflow: auto;
}

.pi-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.pi-table thead th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  text-align: start;
  padding: 0.55rem 1rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.pi-th-row {
  width: 64px;
}

.pi-th-col {
  width: 130px;
}

.pi-table tbody td {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #f8fafc;
  color: #334155;
  vertical-align: top;
}

.pi-table tbody tr:last-child td {
  border-bottom: none;
}

.pi-td-row {
  font-weight: 700;
  color: #dc2626;
  font-variant-numeric: tabular-nums;
}

.pi-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  background: #f1f5f9;
  border-radius: 5px;
  padding: 2px 6px;
  color: #475569;
  word-break: break-all;
}

.pi-td-msg {
  line-height: 1.55;
}

/* ─── Yakun ──────────────────────────────────── */
.pi-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  padding: 1.5rem 0.5rem;
}

.pi-done-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pi-done-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.pi-done-text {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 380px;
}

/* ─── Tugmalar ───────────────────────────────── */
.pi-btn-primary,
.pi-btn-ghost,
.pi-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.pi-btn-primary {
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.25);
}

.pi-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.35);
}

.pi-btn-ghost {
  background: #f1f5f9;
  color: #475569;
}

.pi-btn-ghost:hover:not(:disabled) {
  background: #e2e8f0;
}

.pi-btn-outline {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.pi-btn-outline:hover:not(:disabled) {
  border-color: #007bff;
  color: #007bff;
}

.pi-btn-primary:disabled,
.pi-btn-ghost:disabled,
.pi-btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pi-spin {
  animation: pi-rotate 0.9s linear infinite;
}

@keyframes pi-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 520px) {
  .pi-step {
    gap: 0.65rem;
  }

  .pi-table-wrap {
    max-height: 220px;
  }

  .pi-th-col {
    width: 100px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pi-spin {
    animation: none;
  }

  .pi-btn-primary,
  .pi-btn-ghost,
  .pi-btn-outline,
  .pi-drop {
    transition: none;
  }
}
</style>
