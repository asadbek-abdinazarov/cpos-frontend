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
  <div class="pd-page">
    <!-- Back -->
    <button class="pd-back" @click="goBack">
      <ArrowLeft :size="15" />
      {{ $t('dashboard.products.back_to_list') }}
    </button>

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="pd-skeleton">
        <div class="sk sk-hero"></div>
        <div class="sk-row2">
          <div class="sk sk-stat"></div>
          <div class="sk sk-stat"></div>
        </div>
        <div class="sk sk-section"></div>
      </div>
    </template>

    <!-- Not found -->
    <template v-else-if="notFound">
      <div class="pd-empty">
        <div class="pd-empty-icon"><Package :size="32" /></div>
        <p class="pd-empty-title">{{ $t('dashboard.products.not_found') }}</p>
        <button class="pd-btn-ghost" @click="goBack">
          {{ $t('dashboard.products.back_to_list') }}
        </button>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="product">
      <!-- ─── Hero card ───────────────────────────── -->
      <div class="pd-hero">
        <div class="pd-hero-grid"></div>
        <div class="pd-orb pd-orb-1"></div>
        <div class="pd-orb pd-orb-2"></div>
        <div class="pd-hero-body">
          <div class="pd-hero-left">
            <div class="pd-avatar">
              <Package :size="24" />
            </div>
            <div class="pd-hero-info">
              <div class="pd-hero-cat">
                {{ product.category?.name || '—' }}
              </div>
              <h1 class="pd-hero-name">{{ product.name }}</h1>
            </div>
          </div>
          <span
            class="pd-status-badge"
            :class="product.isActive ? 'pd-badge-active' : 'pd-badge-inactive'"
          >
            {{
              product.isActive
                ? $t('dashboard.products.status.active')
                : $t('dashboard.products.status.inactive')
            }}
          </span>
        </div>
      </div>

      <!-- ─── Price + Cost row ─────────────────────── -->
      <div class="pd-stats-row">
        <div class="pd-stat-card">
          <div class="pd-stat-ico"><Tag :size="17" /></div>
          <div class="pd-stat-label">{{ $t('dashboard.products.detail.price') }}</div>
          <div class="pd-stat-val">
            {{ (product.price ?? 0).toLocaleString('uz-UZ') }}
            <span class="pd-currency">UZS</span>
          </div>
        </div>
        <div class="pd-stat-card">
          <div class="pd-stat-ico"><BarChart2 :size="17" /></div>
          <div class="pd-stat-label">{{ $t('dashboard.products.detail.cost') }}</div>
          <div class="pd-stat-val">
            {{ (product.cost ?? 0).toLocaleString('uz-UZ') }}
            <span class="pd-currency">UZS</span>
          </div>
        </div>
      </div>

      <!-- ─── Description ──────────────────────────── -->
      <div class="pd-section" v-if="product.description">
        <div class="pd-section-label">{{ $t('dashboard.products.detail.description') }}</div>
        <p class="pd-desc">{{ product.description }}</p>
      </div>

      <!-- ─── Inventory ────────────────────────────── -->
      <div class="pd-section">
        <div class="pd-section-label">{{ $t('dashboard.products.detail.section_inventory') }}</div>
        <div class="pd-info-grid">
          <div class="pd-info-item">
            <div class="pd-info-ico"><Hash :size="14" /></div>
            <div>
              <div class="pd-info-key">{{ $t('dashboard.products.detail.barcode') }}</div>
              <div class="pd-info-val mono">{{ product.barcode || '—' }}</div>
            </div>
          </div>
          <div class="pd-info-item">
            <div class="pd-info-ico"><Layers :size="14" /></div>
            <div>
              <div class="pd-info-key">{{ $t('dashboard.products.detail.sku') }}</div>
              <div class="pd-info-val mono">{{ product.sku || '—' }}</div>
            </div>
          </div>
          <div class="pd-info-item">
            <div class="pd-info-ico"><BarChart2 :size="14" /></div>
            <div>
              <div class="pd-info-key">{{ $t('dashboard.products.detail.quantity') }}</div>
              <div class="pd-info-val">
                {{ product.quantity }} <span class="pd-unit">{{ product.unit }}</span>
              </div>
            </div>
          </div>
          <div class="pd-info-item">
            <div class="pd-info-ico"><Scale :size="14" /></div>
            <div>
              <div class="pd-info-key">{{ $t('dashboard.products.detail.weighable') }}</div>
              <div class="pd-info-val">
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
        <div class="pd-barcode-wrap" v-if="product.barcode">
          <BarcodeCode128 :value="product.barcode" />
        </div>
      </div>

      <!-- ─── Timestamps ───────────────────────────── -->
      <div class="pd-timestamps">
        <div class="pd-ts-item">
          <Calendar :size="13" class="pd-ts-ico" />
          <span class="pd-ts-label">{{ $t('dashboard.products.detail.created_at') }}:</span>
          <span class="pd-ts-val">{{
            product.createdAt ? new Date(product.createdAt).toLocaleString('uz-UZ') : '—'
          }}</span>
        </div>
        <div class="pd-ts-item">
          <Calendar :size="13" class="pd-ts-ico" />
          <span class="pd-ts-label">{{ $t('dashboard.products.detail.updated_at') }}:</span>
          <span class="pd-ts-val">{{
            product.updatedAt ? new Date(product.updatedAt).toLocaleString('uz-UZ') : '—'
          }}</span>
        </div>
      </div>

      <!-- ─── Actions ──────────────────────────────── -->
      <div class="pd-actions">
        <button class="pd-btn-ghost" @click="goBack">
          {{ $t('dashboard.products.detail.close') }}
        </button>
        <button class="pd-btn-danger-outline" @click="openDeleteModal">
          <Trash2 :size="14" /> {{ $t('dashboard.products.delete_product') }}
        </button>
        <button class="pd-btn-primary" @click="goEdit">
          <Edit :size="14" /> {{ $t('dashboard.products.detail.edit') }}
        </button>
      </div>
    </template>

    <!-- ─── Delete Modal ──────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isDeleteModalOpen" class="pd-modal-overlay" @click.self="closeDeleteModal">
          <div class="pd-modal">
            <div class="pd-modal-icon">
              <Trash2 :size="20" />
            </div>
            <h2 class="pd-modal-title">{{ $t('dashboard.products.delete_confirm_title') }}</h2>
            <p class="pd-modal-text">
              {{ $t('dashboard.products.delete_confirm_text', { name: product?.name }) }}
            </p>
            <div class="pd-modal-actions">
              <button class="pd-btn-ghost" @click="closeDeleteModal">
                {{ $t('dashboard.products.form.cancel') }}
              </button>
              <button class="pd-btn-danger" :disabled="deleting" @click="executeDelete">
                {{
                  deleting
                    ? $t('dashboard.products.deleting')
                    : $t('dashboard.products.delete_product')
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.pd-page {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
}

/* Back button */
.pd-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  font-family: inherit;
  width: fit-content;
}
.pd-back:hover {
  color: #007bff;
}

/* ─── Hero ─────────────────────────────────────── */
.pd-hero {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.5rem;
  overflow: hidden;
}
.pd-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}
.pd-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}
.pd-orb-1 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.08) 0%, transparent 70%);
  top: -80px;
  right: -50px;
}
.pd-orb-2 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%);
  bottom: -60px;
  left: -30px;
}
.pd-hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.pd-hero-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.pd-avatar {
  width: 50px;
  height: 50px;
  border-radius: 13px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.3);
}
.pd-hero-cat {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
  margin-bottom: 0.2rem;
}
.pd-hero-name {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.pd-status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
.pd-badge-active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.pd-badge-inactive {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* ─── Stats row ────────────────────────────────── */
.pd-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.pd-stat-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
}
.pd-stat-primary {
  background: linear-gradient(135deg, #007bff, #6366f1);
  border-color: transparent;
  color: #fff;
}
.pd-stat-ico {
  margin-bottom: 0.5rem;
  opacity: 0.6;
}
.pd-stat-primary .pd-stat-ico {
  color: #bfdbfe;
  opacity: 0.9;
}
.pd-stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}
.pd-stat-primary .pd-stat-label {
  color: rgba(255, 255, 255, 0.7);
}
.pd-stat-val {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
}
.pd-stat-primary .pd-stat-val {
  color: #fff;
}
.pd-currency {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.5;
  margin-left: 2px;
}

/* ─── Section ──────────────────────────────────── */
.pd-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
}
.pd-section-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.85rem;
}
.pd-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.6;
}

/* ─── Info grid ────────────────────────────────── */
.pd-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.pd-info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 0.85rem;
}
.pd-info-ico {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(0, 123, 255, 0.08);
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.pd-info-key {
  font-size: 0.67rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 0.2rem;
}
.pd-info-val {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}
.pd-unit {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}
.mono {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
}

.pd-barcode-wrap {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Timestamps ────────────────────────────────── */
.pd-timestamps {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0 0.25rem;
}
.pd-ts-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
}
.pd-ts-ico {
  color: #cbd5e1;
}
.pd-ts-label {
  color: #94a3b8;
  font-weight: 500;
}
.pd-ts-val {
  color: #64748b;
}

/* ─── Actions ──────────────────────────────────── */
.pd-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding-top: 0.25rem;
}

/* ─── Buttons ──────────────────────────────────── */
.pd-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.25);
  transition: all 0.2s;
  font-family: inherit;
}
.pd-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.35);
}

.pd-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.pd-btn-ghost:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.pd-btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.pd-btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}
.pd-btn-danger:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pd-btn-danger-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: #fff;
  color: #dc2626;
  border: 1.5px solid #fca5a5;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.pd-btn-danger-outline:hover {
  background: #fef2f2;
}

/* ─── Skeleton ──────────────────────────────────── */
.pd-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.sk-row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
@keyframes shimmer {
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
}
.sk {
  border-radius: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 500px 100%;
  animation: shimmer 1.4s infinite linear;
}
.sk-hero {
  height: 90px;
}
.sk-stat {
  height: 88px;
}
.sk-section {
  height: 120px;
}

/* ─── Empty ─────────────────────────────────────── */
.pd-empty {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  color: #64748b;
}
.pd-empty-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: #f1f5f9;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}
.pd-empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 1.25rem;
}

/* ─── Modal ─────────────────────────────────────── */
.pd-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9000;
}
.pd-modal {
  background: #fff;
  border-radius: 18px;
  padding: 2rem 1.75rem 1.5rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.pd-modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}
.pd-modal-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}
.pd-modal-text {
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.55;
}
.pd-modal-actions {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 520px) {
  .pd-stats-row {
    grid-template-columns: 1fr;
  }
  .pd-info-grid {
    grid-template-columns: 1fr;
  }
  .pd-hero-body {
    flex-direction: column;
    align-items: flex-start;
  }
  .pd-actions {
    flex-direction: column;
  }
  .pd-actions > * {
    width: 100%;
    justify-content: center;
  }
  .pd-modal-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  .pd-modal-actions > * {
    width: 100%;
    justify-content: center;
  }
}
</style>
