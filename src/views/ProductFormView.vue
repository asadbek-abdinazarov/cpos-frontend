<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Package, RefreshCw, Sparkles } from 'lucide-vue-next'
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
    if (res.data?.success && Array.isArray(res.data.data)) categories.value = res.data.data
  } catch (err) { console.error(err) }
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
    } else { notFound.value = true }
  } catch (err) {
    if (err.response?.status === 404) notFound.value = true
    else showNotification({ type: 'error', message: err.response?.data?.message || 'Failed to load product' })
  } finally { loading.value = false }
}

function initNewProduct() {
  form.value = {
    name: '', description: '', barcode: '', sku: '',
    quantity: 0, price: 0, cost: 0, unit: 'PIECE',
    isWeighable: false, isActive: true,
    categoryId: categories.value[0]?.id ?? null,
  }
  originalForm.value = null
}

onMounted(async () => {
  await fetchCategories()
  if (isEditMode.value) await fetchProduct()
  else { initNewProduct(); loading.value = false }
})

watch(() => route.params.id, async (newId) => {
  if (newId && newId !== 'new') await fetchProduct()
  else initNewProduct()
}, { immediate: false })

function goBack() { router.push({ name: 'products' }) }

const generatingBarcode = ref(false)
const generatingSku = ref(false)

async function autoGenerateBarcode() {
  generatingBarcode.value = true
  try {
    const res = await generateBarcode()
    if (res.data?.success && res.data?.data?.code) form.value.barcode = res.data.data.code
  } catch (err) {
    showNotification({ type: 'error', message: err.response?.data?.message || 'Failed to generate barcode' })
  } finally { generatingBarcode.value = false }
}

async function autoGenerateSku() {
  generatingSku.value = true
  try {
    const res = await generateSku()
    if (res.data?.success && res.data?.data?.code) form.value.sku = res.data.data.code
  } catch (err) {
    showNotification({ type: 'error', message: err.response?.data?.message || 'Failed to generate SKU' })
  } finally { generatingSku.value = false }
}

async function submit() {
  submitting.value = true
  try {
    if (isEditMode.value) {
      const patch = {}
      for (const key in form.value) {
        if (originalForm.value && form.value[key] !== originalForm.value[key]) patch[key] = form.value[key]
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
  } finally { submitting.value = false }
}
</script>

<template>
  <div class="pf-page">

    <!-- Back -->
    <button class="pf-back" @click="goBack">
      <ArrowLeft :size="15" />
      {{ $t('dashboard.products.back_to_list') }}
    </button>

    <!-- Skeleton -->
    <template v-if="loading && isEditMode">
      <div class="pf-skeleton">
        <div class="sk sk-hero"></div>
        <div class="sk-cols">
          <div class="sk-left">
            <div class="sk sk-section"></div>
            <div class="sk sk-section"></div>
          </div>
          <div class="sk-right">
            <div class="sk sk-section"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Not found -->
    <template v-else-if="notFound">
      <div class="pf-empty">
        <div class="pf-empty-icon"><Package :size="32" /></div>
        <p class="pf-empty-title">{{ $t('dashboard.products.not_found') }}</p>
        <button class="pf-btn-ghost" @click="goBack">{{ $t('dashboard.products.back_to_list') }}</button>
      </div>
    </template>

    <!-- Form -->
    <template v-else>

      <!-- ─── Hero ──────────────────────────────────── -->
      <div class="pf-hero">
        <div class="pf-hero-grid"></div>
        <div class="pf-orb pf-orb-1"></div>
        <div class="pf-orb pf-orb-2"></div>
        <div class="pf-hero-body">
          <div class="pf-hero-left">
            <div class="pf-avatar">
              <Package :size="22" />
            </div>
            <div>
              <div class="pf-hero-mode">
                <Sparkles :size="11" />
                {{ isEditMode ? $t('dashboard.products.edit_product') : $t('dashboard.products.add_product') }}
              </div>
              <h1 class="pf-hero-title">
                {{ isEditMode ? (form.name || $t('dashboard.products.edit_product')) : $t('dashboard.products.add_product') }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── 2-col layout ──────────────────────────── -->
      <form @submit.prevent="submit" class="pf-layout">

        <!-- Left: Basic + Pricing -->
        <div class="pf-col-main">

          <!-- Basic info -->
          <div class="pf-section">
            <div class="pf-section-label">{{ $t('dashboard.products.form.section_basic') }}</div>
            <div class="pf-grid">
              <div class="pf-field pf-col2">
                <label class="pf-label">{{ $t('dashboard.products.form.name') }}</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="pf-input"
                  :placeholder="$t('dashboard.products.form.name_placeholder')"
                />
              </div>
              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.category') }}</label>
                <select v-model="form.categoryId" class="pf-input pf-select">
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="pf-field pf-col2">
                <label class="pf-label">{{ $t('dashboard.products.form.description') }}</label>
                <textarea
                  v-model="form.description"
                  class="pf-input"
                  :placeholder="$t('dashboard.products.form.description_placeholder')"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="pf-section">
            <div class="pf-section-label">{{ $t('dashboard.products.form.section_pricing') }}</div>
            <div class="pf-grid">
              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.unit') }}</label>
                <select v-model="form.unit" class="pf-input pf-select">
                  <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.quantity') }}</label>
                <input
                  v-model.number="form.quantity"
                  type="number" min="0" step="1"
                  class="pf-input"
                  :placeholder="$t('dashboard.products.form.quantity_placeholder')"
                />
              </div>
              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.cost') }}</label>
                <div class="pf-input-addon">
                  <span class="pf-addon-label">UZS</span>
                  <input v-model.number="form.cost" type="number" min="0" step="1" class="pf-input pf-has-addon" placeholder="0" />
                </div>
              </div>
              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.price') }}</label>
                <div class="pf-input-addon">
                  <span class="pf-addon-label pf-addon-primary">UZS</span>
                  <input v-model.number="form.price" type="number" min="0" step="1" class="pf-input pf-has-addon" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Identifiers + Settings -->
        <div class="pf-col-side">

          <!-- Identifiers -->
          <div class="pf-section">
            <div class="pf-section-label">{{ $t('dashboard.products.form.section_identifiers') }}</div>
            <div class="pf-fields-stack">
              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.barcode') }}</label>
                <input
                  v-model="form.barcode"
                  type="text"
                  class="pf-input mono"
                  :placeholder="$t('dashboard.products.form.barcode_placeholder')"
                />
                <button type="button" class="pf-gen-btn" @click="autoGenerateBarcode" :disabled="generatingBarcode">
                  <RefreshCw :size="12" :class="{ spin: generatingBarcode }" />
                  {{ generatingBarcode ? 'Generatsiya...' : 'Auto Generate' }}
                </button>
                <div class="pf-barcode-preview" v-if="form.barcode">
                  <BarcodeCode128 :value="form.barcode" />
                </div>
              </div>

              <div class="pf-field">
                <label class="pf-label">{{ $t('dashboard.products.form.sku') }}</label>
                <input
                  v-model="form.sku"
                  type="text"
                  class="pf-input mono"
                  :placeholder="$t('dashboard.products.form.sku_placeholder')"
                />
                <button type="button" class="pf-gen-btn" @click="autoGenerateSku" :disabled="generatingSku">
                  <RefreshCw :size="12" :class="{ spin: generatingSku }" />
                  {{ generatingSku ? 'Generatsiya...' : 'Auto Generate' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Settings -->
          <div class="pf-section">
            <div class="pf-section-label">{{ $t('dashboard.products.form.section_settings') }}</div>
            <div class="pf-fields-stack">
              <div class="pf-toggle-row">
                <div class="pf-toggle-info">
                  <span class="pf-toggle-label">{{ $t('dashboard.products.form.weighable') }}</span>
                  <span class="pf-toggle-desc">Vazn bo'yicha sotiladi</span>
                </div>
                <div
                  class="pf-toggle"
                  :class="{ active: form.isWeighable }"
                  @click="form.isWeighable = !form.isWeighable"
                >
                  <div class="pf-knob"></div>
                </div>
              </div>
              <div class="pf-toggle-row">
                <div class="pf-toggle-info">
                  <span class="pf-toggle-label">{{ $t('dashboard.products.form.active') }}</span>
                  <span class="pf-toggle-desc">Sotuvda ko'rinadi</span>
                </div>
                <div
                  class="pf-toggle"
                  :class="{ active: form.isActive }"
                  @click="form.isActive = !form.isActive"
                >
                  <div class="pf-knob"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions (full width) -->
        <div class="pf-actions">
          <button type="button" class="pf-btn-ghost" @click="goBack">
            {{ $t('dashboard.products.form.cancel') }}
          </button>
          <button type="submit" class="pf-btn-primary" :disabled="submitting">
            <template v-if="submitting">
              {{ isEditMode ? $t('dashboard.products.form.updating') : $t('dashboard.products.form.saving') }}
            </template>
            <template v-else>
              {{ isEditMode ? $t('dashboard.products.update_product') : $t('dashboard.products.form.save') }}
            </template>
          </button>
        </div>

      </form>
    </template>
  </div>
</template>

<style scoped>
.pf-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
}

/* Back */
.pf-back {
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none; color: #64748b;
  font-size: 0.85rem; font-weight: 500; cursor: pointer;
  padding: 0; width: fit-content; transition: color 0.15s;
  font-family: inherit;
}
.pf-back:hover { color: #007bff; }

/* ─── Hero ─────────────────────────────────────── */
.pf-hero {
  position: relative;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 18px; padding: 1.5rem;
  overflow: hidden;
}
.pf-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px; pointer-events: none;
}
.pf-orb { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
.pf-orb-1 {
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(0,123,255,0.09) 0%, transparent 70%);
  top: -70px; right: -50px;
}
.pf-orb-2 {
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
  bottom: -60px; left: -30px;
}
.pf-hero-body { position: relative; z-index: 1; }
.pf-hero-left { display: flex; align-items: center; gap: 1rem; }
.pf-avatar {
  width: 48px; height: 48px; border-radius: 13px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,123,255,0.3);
}
.pf-hero-mode {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: #007bff; margin-bottom: 0.2rem;
  background: rgba(0,123,255,0.08); border: 1px solid rgba(0,123,255,0.18);
  padding: 0.2rem 0.6rem; border-radius: 100px;
}
.pf-hero-title {
  margin: 0; font-size: 1.3rem; font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #007bff 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* ─── 2-column layout ──────────────────────────── */
.pf-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  grid-template-rows: auto auto;
  gap: 1rem;
  align-items: start;
}
.pf-col-main { display: flex; flex-direction: column; gap: 1rem; }
.pf-col-side { display: flex; flex-direction: column; gap: 1rem; }
.pf-actions {
  grid-column: 1 / -1;
  display: flex; gap: 0.6rem; flex-wrap: wrap;
  padding-top: 0.25rem;
}

/* ─── Section ──────────────────────────────────── */
.pf-section {
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 14px; padding: 1.25rem 1.5rem;
}
.pf-section-label {
  font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: #94a3b8; margin-bottom: 1rem;
}

/* ─── Fields ───────────────────────────────────── */
.pf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.pf-fields-stack {
  display: flex; flex-direction: column; gap: 0.85rem;
}
.pf-field { display: flex; flex-direction: column; gap: 0.35rem; }
.pf-col2 { grid-column: span 2; }

.pf-label {
  font-size: 0.8rem; font-weight: 600; color: #475569;
}

.pf-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem; color: #0f172a;
  background: #f8fafc;
  outline: none; transition: all 0.2s;
  font-family: inherit; box-sizing: border-box;
}
.pf-input::placeholder { color: #94a3b8; }
.pf-input:focus {
  border-color: #007bff; background: #fff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.08);
}

.pf-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.6rem center;
  background-repeat: no-repeat;
  background-size: 1.4em 1.4em;
  padding-right: 2.25rem;
  cursor: pointer;
}

textarea.pf-input { resize: vertical; min-height: 80px; }

/* Addon (UZS prefix) */
.pf-input-addon {
  position: relative;
}
.pf-addon-label {
  position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
  font-size: 0.72rem; font-weight: 700; color: #94a3b8;
  pointer-events: none; user-select: none;
}
.pf-addon-primary { color: #007bff; }
.pf-has-addon { padding-left: 3rem; }
.pf-input-addon .pf-input { width: 100%; }

.mono { font-family: 'Courier New', monospace; font-size: 0.88rem; }

/* ─── Generate button ──────────────────────────── */
.pf-gen-btn {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.18);
  color: #007bff;
  font-size: 0.75rem; font-weight: 600;
  cursor: pointer; padding: 0.3rem 0.65rem;
  border-radius: 7px; transition: all 0.15s;
  align-self: flex-start; font-family: inherit;
  margin-top: 0.1rem;
}
.pf-gen-btn:hover:not(:disabled) { background: rgba(0,123,255,0.14); }
.pf-gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.pf-barcode-preview {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Toggle ───────────────────────────────────── */
.pf-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.85rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
}
.pf-toggle-info { display: flex; flex-direction: column; gap: 1px; }
.pf-toggle-label { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
.pf-toggle-desc { font-size: 0.75rem; color: #94a3b8; }
.pf-toggle {
  width: 44px; height: 24px;
  background: #e2e8f0; border-radius: 100px;
  position: relative; cursor: pointer;
  transition: background 0.2s; flex-shrink: 0;
}
.pf-toggle.active { background: linear-gradient(135deg, #007bff, #6366f1); }
.pf-knob {
  width: 20px; height: 20px;
  background: #fff; border-radius: 50%;
  position: absolute; top: 2px; left: 2px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.pf-toggle.active .pf-knob { transform: translateX(20px); }

/* ─── Buttons ──────────────────────────────────── */
.pf-btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0.65rem 1.4rem;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff; border: none; border-radius: 10px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,123,255,0.25);
  transition: all 0.2s; font-family: inherit;
}
.pf-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,123,255,0.35); }
.pf-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.pf-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0.65rem 1.2rem;
  background: #f1f5f9; color: #475569;
  border: none; border-radius: 10px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s; font-family: inherit;
}
.pf-btn-ghost:hover { background: #e2e8f0; color: #0f172a; }

/* ─── Skeleton ──────────────────────────────────── */
.pf-skeleton { display: flex; flex-direction: column; gap: 1rem; }
.sk-cols { display: grid; grid-template-columns: 1fr 340px; gap: 1rem; }
.sk-left, .sk-right { display: flex; flex-direction: column; gap: 1rem; }
@keyframes shimmer {
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
}
.sk {
  border-radius: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 500px 100%;
  animation: shimmer 1.4s infinite linear;
}
.sk-hero { height: 88px; }
.sk-section { height: 160px; }

/* ─── Empty ─────────────────────────────────────── */
.pf-empty {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 16px; color: #64748b;
}
.pf-empty-icon {
  width: 60px; height: 60px; border-radius: 14px;
  background: #f1f5f9; color: #cbd5e1;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
}
.pf-empty-title { font-size: 0.95rem; font-weight: 600; color: #475569; margin-bottom: 1.25rem; }

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 900px) {
  .pf-layout {
    grid-template-columns: 1fr;
  }
  .pf-col-side { display: contents; }
  .pf-actions { grid-column: 1; }
  .sk-cols { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .pf-grid { grid-template-columns: 1fr; }
  .pf-col2 { grid-column: span 1; }
  .pf-hero-left { gap: 0.75rem; }
  .pf-hero-title { font-size: 1.1rem; }
  .pf-actions { flex-direction: column; }
  .pf-actions > * { width: 100%; justify-content: center; }
}
</style>
