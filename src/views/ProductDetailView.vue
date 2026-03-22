<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Package,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
  BarChart2,
  Hash,
  Layers,
  Scale,
  Calendar,
} from 'lucide-vue-next'
import { getProduct, deleteProduct } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import BarcodeCode128 from '@/components/BarcodeCode128.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showNotification } = useNotification()

const product = ref(null)
const loading = ref(true)
const notFound = ref(false)
const isDeleteModalOpen = ref(false)
const deleting = ref(false)

async function fetchProduct() {
  const id = route.params.id
  if (!id) {
    notFound.value = true
    loading.value = false
    return
  }
  loading.value = true
  notFound.value = false
  product.value = null
  try {
    const res = await getProduct(id)
    if (res.data?.success && res.data?.data) product.value = res.data.data
    else notFound.value = true
  } catch (err) {
    if (err.response?.status === 404) notFound.value = true
    else
      showNotification({
        type: 'error',
        message: err.response?.data?.message || t('dashboard.products.load_failed'),
      })
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)
watch(() => route.params.id, fetchProduct)

function goBack() {
  router.push({ name: 'products' })
}
function goEdit() {
  if (product.value?.id) router.push({ name: 'productEdit', params: { id: product.value.id } })
}
function openDeleteModal() {
  isDeleteModalOpen.value = true
}
function closeDeleteModal() {
  isDeleteModalOpen.value = false
}

async function executeDelete() {
  if (!product.value?.id) return
  deleting.value = true
  try {
    const res = await deleteProduct(product.value.id)
    if (res.data?.success) {
      showNotification({ type: 'success', message: t('dashboard.products.deleted_success') })
      router.push({ name: 'products' })
    }
  } catch (err) {
    showNotification({
      type: 'error',
      message: err.response?.data?.message || t('dashboard.products.delete_failed'),
    })
  } finally {
    deleting.value = false
    closeDeleteModal()
  }
}
</script>

<template>
  <div class="page">
    <!-- Back -->
    <button class="back-btn" @click="goBack">
      <ArrowLeft :size="16" />
      <span>{{ $t('dashboard.products.back_to_list') }}</span>
    </button>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="skeleton-wrap">
        <div class="sk sk-hero"></div>
        <div class="sk sk-row"></div>
        <div class="sk sk-row"></div>
      </div>
    </template>

    <!-- Not found -->
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

    <!-- Product content -->
    <template v-else-if="product">
      <!-- Hero card -->
      <div class="hero-card">
        <div class="hero-left">
          <div class="hero-avatar">
            <Package :size="26" />
          </div>
          <div>
            <div class="hero-cat">{{ product.category?.name || '—' }}</div>
            <h1 class="hero-name">{{ product.name }}</h1>
          </div>
        </div>
        <span class="badge" :class="product.isActive ? 'badge-active' : 'badge-inactive'">
          {{
            product.isActive
              ? $t('dashboard.products.status.active')
              : $t('dashboard.products.status.inactive')
          }}
        </span>
      </div>

      <!-- Description -->
      <div class="section" v-if="product.description">
        <p class="section-label">{{ $t('dashboard.products.detail.description') }}</p>
        <p class="desc-text">{{ product.description }}</p>
      </div>

      <!-- Pricing row -->
      <div class="two-col">
        <div class="stat-card accent">
          <div class="stat-icon"><Tag :size="18" /></div>
          <div class="stat-label">{{ $t('dashboard.products.detail.price') }}</div>
          <div class="stat-value">
            {{ (product.price ?? 0).toLocaleString('uz-UZ') }} <span class="currency">UZS</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><BarChart2 :size="18" /></div>
          <div class="stat-label">{{ $t('dashboard.products.detail.cost') }}</div>
          <div class="stat-value">
            {{ (product.cost ?? 0).toLocaleString('uz-UZ') }} <span class="currency">UZS</span>
          </div>
        </div>
      </div>

      <!-- Inventory grid -->
      <div class="section">
        <p class="section-label">{{ $t('dashboard.products.detail.section_inventory') }}</p>
        <div class="info-grid">
          <div class="info-item">
            <Hash :size="15" class="info-ico" />
            <div>
              <div class="info-key">{{ $t('dashboard.products.detail.barcode') }}</div>
              <div class="info-val mono">{{ product.barcode || '—' }}</div>
            </div>
          </div>
          <div class="info-item">
            <Layers :size="15" class="info-ico" />
            <div>
              <div class="info-key">{{ $t('dashboard.products.detail.sku') }}</div>
              <div class="info-val mono">{{ product.sku || '—' }}</div>
            </div>
          </div>
          <div class="info-item">
            <BarChart2 :size="15" class="info-ico" />
            <div>
              <div class="info-key">{{ $t('dashboard.products.detail.quantity') }}</div>
              <div class="info-val">{{ product.quantity }} {{ product.unit }}</div>
            </div>
          </div>
          <div class="info-item">
            <Scale :size="15" class="info-ico" />
            <div>
              <div class="info-key">{{ $t('dashboard.products.detail.weighable') }}</div>
              <div class="info-val">
                {{
                  product.isWeighable
                    ? $t('dashboard.products.detail.yes')
                    : $t('dashboard.products.detail.no')
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- Barcode visual -->
        <div class="barcode-wrap" v-if="product.barcode">
          <BarcodeCode128 :value="product.barcode" />
        </div>
      </div>

      <!-- Timestamps -->
      <div class="timestamps">
        <div class="ts-item">
          <Calendar :size="14" class="ts-ico" />
          <span class="ts-label">{{ $t('dashboard.products.detail.created_at') }}:</span>
          <span class="ts-val">{{
            product.createdAt ? new Date(product.createdAt).toLocaleString('uz-UZ') : '—'
          }}</span>
        </div>
        <div class="ts-item">
          <Calendar :size="14" class="ts-ico" />
          <span class="ts-label">{{ $t('dashboard.products.detail.updated_at') }}:</span>
          <span class="ts-val">{{
            product.updatedAt ? new Date(product.updatedAt).toLocaleString('uz-UZ') : '—'
          }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="btn btn-ghost" @click="goBack">
          {{ $t('dashboard.products.detail.close') }}
        </button>
        <button class="btn btn-danger-outline" @click="openDeleteModal">
          <Trash2 :size="15" /> {{ $t('dashboard.products.delete_product') }}
        </button>
        <button class="btn btn-primary" @click="goEdit">
          <Edit :size="15" /> {{ $t('dashboard.products.detail.edit') }}
        </button>
      </div>
    </template>

    <!-- Delete modal -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal">
          <div class="modal-icon-wrap">
            <Trash2 :size="22" />
          </div>
          <h2 class="modal-title">{{ $t('dashboard.products.delete_confirm_title') }}</h2>
          <p class="modal-text">
            {{ $t('dashboard.products.delete_confirm_text', { name: product?.name }) }}
          </p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="closeDeleteModal">
              {{ $t('dashboard.products.form.cancel') }}
            </button>
            <button class="btn btn-danger" :disabled="deleting" @click="executeDelete">
              {{
                deleting
                  ? $t('dashboard.products.deleting')
                  : $t('dashboard.products.delete_product')
              }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ─── Base ─────────────────────────────────────────── */
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
  background: #2e6bee;
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

/* ─── Badge ─────────────────────────────────────────── */
.badge {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.badge-active {
  background: #d1fae5;
  color: #065f46;
}
.badge-inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* ─── Section ───────────────────────────────────────── */
.section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
}
.section-label {
  margin: 0 0 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}
.desc-text {
  margin: 0;
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.6;
}

/* ─── Stat cards ─────────────────────────────────────── */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
}
.stat-card.accent {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.stat-icon {
  margin-bottom: 0.5rem;
  opacity: 0.5;
}
.stat-card.accent .stat-icon {
  opacity: 0.8;
  color: #93c5fd;
}
.stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}
.stat-card.accent .stat-label {
  color: #bfdbfe;
}
.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.stat-card.accent .stat-value {
  color: #fff;
}
.currency {
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0.55;
}

/* ─── Info grid ─────────────────────────────────────── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 10px;
}
.info-ico {
  color: #9ca3af;
  margin-top: 2px;
  flex-shrink: 0;
}
.info-key {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  margin-bottom: 0.2rem;
}
.info-val {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}
.mono {
  font-family: 'Geist Mono', 'Fira Code', monospace;
  font-size: 0.88rem;
}

/* ─── Barcode ───────────────────────────────────────── */
.barcode-wrap {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-start;
}

/* ─── Timestamps ─────────────────────────────────────── */
.timestamps {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0 0.25rem;
}
.ts-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
}
.ts-ico {
  color: #d1d5db;
}
.ts-label {
  color: #9ca3af;
  font-weight: 500;
}
.ts-val {
  color: #6b7280;
}

/* ─── Actions ───────────────────────────────────────── */
.actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding-top: 0.25rem;
}

/* ─── Buttons ───────────────────────────────────────── */
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
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-ghost {
  background: #f3f4f6;
  color: #374151;
}
.btn-ghost:hover {
  background: #e5e7eb;
}
.btn-danger {
  background: #dc2626;
  color: #fff;
}
.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}
.btn-danger:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn-danger-outline {
  background: #fff;
  color: #dc2626;
  border: 1px solid #fca5a5;
}
.btn-danger-outline:hover {
  background: #fef2f2;
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

/* ─── Modal ─────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 999;
  backdrop-filter: blur(3px);
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 2rem 1.75rem 1.5rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
}
.modal-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.modal-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}
.modal-text {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
}

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 520px) {
  .two-col {
    grid-template-columns: 1fr;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .hero-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
