<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Package, RefreshCw } from 'lucide-vue-next'
import { getProduct, getCategories, createProduct, updateProduct, generateBarcode, generateSku } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import BarcodeCode128 from '@/components/BarcodeCode128.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showNotification } = useNotification()

const isEditMode = computed(() => !!route.params.id && route.params.id !== 'new')
const productId = computed(() => route.params.id)

const categories = ref([])
const loading = ref(true)
const submitting = ref(false)
const notFound = ref(false)

const form = ref({
  name: '',
  description: '',
  barcode: '',
  sku: '',
  quantity: 0,
  price: 0,
  cost: 0,
  unit: 'PIECE',
  isWeighable: false,
  isActive: true,
  categoryId: null,
})

const originalForm = ref(null)
const units = ['PIECE', 'KG', 'LITER', 'METER', 'BOX']

async function fetchCategories() {
  try {
    const res = await getCategories()
    if (res.data?.success && Array.isArray(res.data.data)) {
      categories.value = res.data.data
    }
  } catch (err) {
    console.error(err)
  }
}

async function fetchProduct() {
  if (!isEditMode.value || !productId.value) return
  loading.value = true
  notFound.value = false
  try {
    const res = await getProduct(productId.value)
    if (res.data?.success && res.data?.data) {
      const p = res.data.data
      form.value = {
        name: p.name || '',
        description: p.description || '',
        barcode: p.barcode || '',
        sku: p.sku || '',
        quantity: p.quantity ?? 0,
        price: p.price ?? 0,
        cost: p.cost ?? 0,
        unit: p.unit || 'PIECE',
        isWeighable: !!p.isWeighable,
        isActive: !!p.isActive,
        categoryId: p.category?.id ?? (categories.value[0]?.id || null),
      }
      originalForm.value = { ...form.value }
    } else {
      notFound.value = true
    }
  } catch (err) {
    if (err.response?.status === 404) notFound.value = true
    else
      showNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to load product',
      })
  } finally {
    loading.value = false
  }
}

function initNewProduct() {
  form.value = {
    name: '',
    description: '',
    barcode: '',
    sku: '',
    quantity: 0,
    price: 0,
    cost: 0,
    unit: 'PIECE',
    isWeighable: false,
    isActive: true,
    categoryId: categories.value[0]?.id ?? null,
  }
  originalForm.value = null
}

onMounted(async () => {
  await fetchCategories()
  if (isEditMode.value) await fetchProduct()
  else initNewProduct()
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== 'new') {
      await fetchProduct()
    } else {
      initNewProduct()
    }
  },
  { immediate: false },
)

function goBack() {
  router.push({ name: 'products' })
}

const generatingBarcode = ref(false)
const generatingSku = ref(false)

async function autoGenerateBarcode() {
  generatingBarcode.value = true
  try {
    const res = await generateBarcode()
    if (res.data?.success && res.data?.data?.code) {
      form.value.barcode = res.data.data.code
    }
  } catch (err) {
    showNotification({ type: 'error', message: err.response?.data?.message || 'Failed to generate barcode' })
  } finally {
    generatingBarcode.value = false
  }
}

async function autoGenerateSku() {
  generatingSku.value = true
  try {
    const res = await generateSku()
    if (res.data?.success && res.data?.data?.code) {
      form.value.sku = res.data.data.code
    }
  } catch (err) {
    showNotification({ type: 'error', message: err.response?.data?.message || 'Failed to generate SKU' })
  } finally {
    generatingSku.value = false
  }
}

async function submit() {
  submitting.value = true
  try {
    if (isEditMode.value) {
      const patch = {}
      for (const key in form.value) {
        if (originalForm.value && form.value[key] !== originalForm.value[key]) {
          patch[key] = form.value[key]
        }
      }
      if (Object.keys(patch).length === 0) {
        showNotification({ type: 'info', message: t('dashboard.products.no_changes') })
        submitting.value = false
        return
      }
      const res = await updateProduct(productId.value, patch)
      if (res.data?.success) {
        showNotification({ type: 'success', message: t('dashboard.products.updated_success') })
        router.push({ name: 'productDetail', params: { id: productId.value } })
      }
    } else {
      const res = await createProduct(form.value)
      if (res.data?.success && res.data?.data?.id) {
        showNotification({ type: 'success', message: t('dashboard.products.created_success') })
        router.push({ name: 'productDetail', params: { id: res.data.data.id } })
      }
    }
  } catch (err) {
    showNotification({ type: 'error', message: err.response?.data?.message || 'Request failed' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <button class="back-btn" @click="goBack">
      <ArrowLeft :size="16" />
      <span>{{ $t('dashboard.products.back_to_list') }}</span>
    </button>

    <template v-if="loading && isEditMode">
      <div class="skeleton-wrap">
        <div class="sk sk-hero"></div>
        <div class="sk sk-row"></div>
        <div class="sk sk-row"></div>
      </div>
    </template>

    <template v-else-if="notFound">
      <div class="empty-state">
        <div class="empty-icon">
          <Package :size="36" />
        </div>
        <p class="empty-title">{{ $t('dashboard.products.not_found') }}</p>
        <button class="btn btn-primary" @click="goBack">
          {{ $t('dashboard.products.back_to_list') }}
        </button>
      </div>
    </template>

    <template v-else>
      <div class="hero-card mb-4" style="margin-bottom: 1rem">
        <div class="hero-left">
          <div class="hero-avatar">
            <Package :size="26" />
          </div>
          <div>
            <div class="hero-cat">{{ isEditMode ? 'Edit' : 'Create' }}</div>
            <h1 class="hero-name">
              {{
                isEditMode
                  ? $t('dashboard.products.edit_product')
                  : $t('dashboard.products.add_product')
              }}
            </h1>
          </div>
        </div>
      </div>

      <form @submit.prevent="submit" class="form-layout">
        <div class="section">
          <p class="section-label">{{ $t('dashboard.products.form.section_basic') }}</p>
          <div class="form-grid">
            <div class="data-group col-span-2">
              <label>{{ $t('dashboard.products.form.name') }}</label>
              <input
                v-model="form.name"
                type="text"
                class="premium-input"
                :placeholder="$t('dashboard.products.form.name_placeholder')"
              />
            </div>
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.category') }}</label>
              <select v-model="form.categoryId" class="premium-input select">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="data-group col-span-2">
              <label>{{ $t('dashboard.products.form.description') }}</label>
              <textarea
                v-model="form.description"
                class="premium-input"
                :placeholder="$t('dashboard.products.form.description_placeholder')"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="section">
          <p class="section-label">{{ $t('dashboard.products.form.section_pricing') }}</p>
          <div class="form-grid">
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.unit') }}</label>
              <select v-model="form.unit" class="premium-input select">
                <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.quantity') }}</label>
              <input
                v-model.number="form.quantity"
                type="number"
                class="premium-input"
                min="0"
                step="1"
                :placeholder="$t('dashboard.products.form.quantity_placeholder')"
              />
            </div>
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.cost') }}</label>
              <input
                v-model.number="form.cost"
                type="number"
                class="premium-input"
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.price') }}</label>
              <input
                v-model.number="form.price"
                type="number"
                class="premium-input"
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div class="section">
          <p class="section-label">{{ $t('dashboard.products.form.section_identifiers') }}</p>
          <div class="form-grid">
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.barcode') }}</label>
              <input
                v-model="form.barcode"
                type="text"
                class="premium-input mono-text"
                :placeholder="$t('dashboard.products.form.barcode_placeholder')"
              />
              <button type="button" class="auto-gen-btn" @click="autoGenerateBarcode" :disabled="generatingBarcode">
                <RefreshCw :size="14" :class="{'spin': generatingBarcode}" />
                {{ generatingBarcode ? 'Generating...' : 'Auto Generate' }}
              </button>
              <div class="barcode-preview" v-if="form.barcode">
                <BarcodeCode128 :value="form.barcode" />
              </div>
            </div>
            <div class="data-group">
              <label>{{ $t('dashboard.products.form.sku') }}</label>
              <input
                v-model="form.sku"
                type="text"
                class="premium-input mono-text"
                :placeholder="$t('dashboard.products.form.sku_placeholder')"
              />
              <button type="button" class="auto-gen-btn" @click="autoGenerateSku" :disabled="generatingSku">
                <RefreshCw :size="14" :class="{'spin': generatingSku}" />
                {{ generatingSku ? 'Generating...' : 'Auto Generate' }}
              </button>
            </div>
          </div>
        </div>

        <div class="section">
          <p class="section-label">{{ $t('dashboard.products.form.section_settings') }}</p>
          <div class="form-grid">
            <div class="data-group toggle-group">
              <label>{{ $t('dashboard.products.form.weighable') }}</label>
              <div
                class="toggle-switch"
                :class="{ active: form.isWeighable }"
                @click="form.isWeighable = !form.isWeighable"
              >
                <div class="toggle-knob"></div>
              </div>
            </div>
            <div class="data-group toggle-group">
              <label>{{ $t('dashboard.products.form.active') }}</label>
              <div
                class="toggle-switch"
                :class="{ active: form.isActive }"
                @click="form.isActive = !form.isActive"
              >
                <div class="toggle-knob"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn btn-ghost" @click="goBack">
            {{ $t('dashboard.products.form.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <template v-if="submitting">
              {{
                isEditMode
                  ? $t('dashboard.products.form.updating')
                  : $t('dashboard.products.form.saving')
              }}
            </template>
            <template v-else>
              {{
                isEditMode
                  ? $t('dashboard.products.update_product')
                  : $t('dashboard.products.form.save')
              }}
            </template>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
/* ─── Base (From Detail View) ───────────────────────── */
.page {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Geist', 'DM Sans', system-ui, sans-serif;
}

/* ─── Back button ───────────────────────────────────── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  width: fit-content;
  transition: color 0.18s;
}
.back-btn:hover {
  color: #111827;
}

/* ─── Hero card ─────────────────────────────────────── */
.hero-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.hero-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.hero-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hero-cat {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.2rem;
}
.hero-name {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
}

/* ─── Skeleton ──────────────────────────────────────── */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.sk {
  border-radius: 14px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
  background-size: 600px 100%;
  animation: shimmer 1.4s infinite linear;
}
.sk-hero {
  height: 82px;
}
.sk-row {
  height: 96px;
}
@keyframes shimmer {
  0% {
    background-position: -600px 0;
  }
  100% {
    background-position: 600px 0;
  }
}

/* ─── Empty state ───────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  color: #6b7280;
}
.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.empty-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: #374151;
}

/* ─── Section ───────────────────────────────────────── */
.section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}
.section-label {
  margin: 0 0 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

/* ─── Forms ─────────────────────────────────────────── */
.form-layout {
  display: flex;
  flex-direction: column;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.data-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.data-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}
.premium-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  color: #0f172a;
  transition: all 0.2s;
  background: white;
  box-sizing: border-box;
}
.premium-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.premium-input.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
textarea.premium-input {
  resize: vertical;
  min-height: 80px;
}
.mono-text {
  font-family: 'Geist Mono', 'Fira Code', monospace;
}
.barcode-preview {
  margin-top: 0.5rem;
  display: flex;
}

/* ─── Toggles ───────────────────────────────────────── */
.toggle-group {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.toggle-switch {
  width: 44px;
  height: 24px;
  background-color: #e2e8f0;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}
.toggle-switch.active {
  background-color: #2563eb;
}
.toggle-knob {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.toggle-switch.active .toggle-knob {
  transform: translateX(20px);
}
.col-span-2 {
  grid-column: span 2;
}

/* ─── Actions & Buttons ───────────────────────────────────────── */
.actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-ghost {
  background: #f3f4f6;
  color: #374151;
}
.btn-ghost:hover {
  background: #e5e7eb;
}

.auto-gen-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-top: 0.25rem;
  align-self: flex-start;
}
.auto-gen-btn:hover:not(:disabled) {
  text-decoration: underline;
  color: #1d4ed8;
}
.auto-gen-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
  .hero-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
