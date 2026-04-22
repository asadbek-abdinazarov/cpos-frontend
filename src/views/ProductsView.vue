<script setup>
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-vue-next'
import { useProductList } from '@/composables/useProductList'

const {
  loading,
  totalElements,
  totalPages,
  searchQuery,
  selectedCategory,
  selectedStatus,
  categories,
  statuses,
  currentPage,
  itemsPerPage,
  filteredProducts,
  onSearchSubmit,
  nextPage,
  prevPage,
  goToProductDetail,
  goToProductEdit,
  goToProductNew,
  selectedProductIds,
  isAllSelected,
  toggleSelectAll,
  isDeleteModalOpen,
  productToDelete,
  confirmDelete,
  closeDeleteModal,
  executeDelete,
  isBatchDeleteModalOpen,
  confirmBatchDelete,
  closeBatchDeleteModal,
  executeBatchDelete,
} = useProductList()
</script>

<template>
  <div class="products-page">

    <!-- ─── Hero ───────────────────────────────────── -->
    <div class="pp-hero">
      <div class="pp-hero-grid"></div>
      <div class="pp-orb pp-orb-1"></div>
      <div class="pp-orb pp-orb-2"></div>

      <div class="pp-hero-body">
        <div class="pp-hero-left">
          <div class="pp-badge">
            <Package :size="11" />
            {{ $t('dashboard.products.title') }}
          </div>
          <h1 class="pp-title">{{ $t('dashboard.products.title') }}</h1>
          <p class="pp-subtitle">{{ $t('dashboard.products.subtitle') }}</p>
        </div>
        <div class="pp-hero-actions">
          <button
            v-if="selectedProductIds.length > 0"
            class="pp-btn-danger"
            @click="confirmBatchDelete"
          >
            <Trash2 :size="15" />
            {{ $t('dashboard.products.delete_selected') }} ({{ selectedProductIds.length }})
          </button>
          <button class="pp-btn-primary" @click="goToProductNew">
            <Plus :size="15" />
            {{ $t('dashboard.products.add_product') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Toolbar ──────────────────────────────── -->
    <div class="pp-toolbar">
      <form @submit.prevent="onSearchSubmit" class="pp-search-wrap">
        <div class="pp-search-box">
          <Search class="pp-search-ico" :size="16" />
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('dashboard.products.search_placeholder')"
            class="pp-search-input"
          />
        </div>
        <button type="submit" class="pp-search-btn">
          {{ $t('dashboard.products.search_btn') }}
        </button>
      </form>

      <div class="pp-filters">
        <div class="pp-filter-item">
          <SlidersHorizontal :size="14" class="pp-filter-ico" />
          <select v-model="selectedCategory" class="pp-filter-select">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="pp-filter-item">
          <Filter :size="14" class="pp-filter-ico" />
          <select v-model="selectedStatus" class="pp-filter-select">
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- ─── Table card ───────────────────────────── -->
    <div class="pp-card">
      <div class="pp-table-wrap">
        <table class="pp-table">
          <thead>
            <tr>
              <th class="th-check">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" class="pp-checkbox" />
              </th>
              <th>{{ $t('dashboard.table.id') }}</th>
              <th>{{ $t('dashboard.table.product') }}</th>
              <th>{{ $t('dashboard.table.category') }}</th>
              <th>{{ $t('dashboard.table.price') }}</th>
              <th>{{ $t('dashboard.table.stock') }}</th>
              <th>{{ $t('dashboard.table.status') }}</th>
              <th class="th-actions">{{ $t('dashboard.table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton -->
            <template v-if="loading">
              <tr v-for="n in itemsPerPage" :key="n" class="skel-row">
                <td><div class="skel skel-check"></div></td>
                <td><div class="skel" style="width:28px;height:12px"></div></td>
                <td>
                  <div class="pp-product-cell">
                    <div class="skel skel-img"></div>
                    <div class="skel skel-name"></div>
                  </div>
                </td>
                <td><div class="skel skel-cat"></div></td>
                <td><div class="skel skel-price"></div></td>
                <td><div class="skel skel-qty"></div></td>
                <td><div class="skel skel-badge"></div></td>
                <td>
                  <div style="display:flex;gap:.4rem;justify-content:flex-end">
                    <div class="skel skel-act"></div>
                    <div class="skel skel-act"></div>
                    <div class="skel skel-act"></div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Rows -->
            <tr
              v-else
              v-for="product in filteredProducts"
              :key="product.id"
              class="pp-row"
              @click="goToProductDetail(product)"
            >
              <td @click.stop>
                <input type="checkbox" :value="product.id" v-model="selectedProductIds" class="pp-checkbox" />
              </td>
              <td class="td-id">#{{ product.id }}</td>
              <td>
                <div class="pp-product-cell">
                  <div class="pp-product-thumb">
                    <Package :size="17" />
                  </div>
                  <span class="pp-product-name">{{ product.name }}</span>
                </div>
              </td>
              <td class="td-cat">{{ product.category ? product.category.name : '—' }}</td>
              <td class="td-price">{{ product.price.toLocaleString('uz-UZ') }} <span class="currency">UZS</span></td>
              <td class="td-qty">{{ product.quantity }}</td>
              <td>
                <span class="pp-status" :class="product.isActive ? 'pp-status-active' : 'pp-status-inactive'">
                  {{ product.isActive ? $t('dashboard.products.status.active') : $t('dashboard.products.status.inactive') }}
                </span>
              </td>
              <td @click.stop>
                <div class="pp-actions-cell">
                  <button class="pp-act-btn" :title="$t('dashboard.table.actions')" @click.stop="goToProductDetail(product)">
                    <Eye :size="14" />
                  </button>
                  <button class="pp-act-btn" @click.stop="goToProductEdit(product)">
                    <Edit :size="14" />
                  </button>
                  <button class="pp-act-btn pp-act-del" @click.stop="confirmDelete(product)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="!loading && filteredProducts.length === 0">
              <td colspan="8" class="pp-empty">
                <div class="pp-empty-inner">
                  <div class="pp-empty-icon">
                    <Package :size="28" />
                  </div>
                  <p>{{ $t('dashboard.products.no_products') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pp-pagination">
        <span class="pp-page-info">
          {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, totalElements) }}
          / {{ totalElements }}
        </span>
        <div class="pp-page-controls">
          <button class="pp-page-btn" @click="prevPage" :disabled="currentPage === 1">
            <ChevronLeft :size="15" />
          </button>
          <span class="pp-page-num">{{ currentPage }}</span>
          <button class="pp-page-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <ChevronRight :size="15" />
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Single delete modal ──────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isDeleteModalOpen" class="pp-modal-overlay" @click.self="closeDeleteModal">
          <div class="pp-modal">
            <div class="pp-modal-icon del-icon">
              <AlertTriangle :size="22" />
            </div>
            <h2 class="pp-modal-title">{{ $t('dashboard.products.delete_confirm_title') }}</h2>
            <p class="pp-modal-text">
              {{ $t('dashboard.products.delete_confirm_text', { name: productToDelete?.name }) }}
            </p>
            <div class="pp-modal-actions">
              <button class="pp-btn-ghost" @click="closeDeleteModal">{{ $t('dashboard.products.form.cancel') }}</button>
              <button class="pp-btn-danger" @click="executeDelete">{{ $t('dashboard.products.delete_product') }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Batch delete modal ───────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isBatchDeleteModalOpen" class="pp-modal-overlay" @click.self="closeBatchDeleteModal">
          <div class="pp-modal">
            <div class="pp-modal-icon del-icon">
              <AlertTriangle :size="22" />
            </div>
            <h2 class="pp-modal-title">{{ $t('dashboard.products.delete_selected') }}</h2>
            <p class="pp-modal-text">
              <strong>{{ selectedProductIds.length }}</strong> ta mahsulot o'chiriladi. Bu amalni bekor qilib bo'lmaydi.
            </p>
            <div class="pp-modal-actions">
              <button class="pp-btn-ghost" @click="closeBatchDeleteModal">{{ $t('dashboard.products.form.cancel') }}</button>
              <button class="pp-btn-danger" @click="executeBatchDelete">{{ $t('dashboard.products.delete_product') }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── Hero ─────────────────────────────────────── */
.pp-hero {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.75rem 2rem;
  overflow: hidden;
}

.pp-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.pp-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}
.pp-orb-1 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(0,123,255,0.09) 0%, transparent 70%);
  top: -100px; right: -60px;
}
.pp-orb-2 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
  bottom: -80px; left: -40px;
}

.pp-hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.pp-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.18);
  color: #007bff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.pp-title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #007bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.pp-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.pp-hero-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* ─── Buttons ──────────────────────────────────── */
.pp-btn-primary {
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
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0,123,255,0.25);
  font-family: inherit;
}
.pp-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,123,255,0.35);
}

.pp-btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.pp-btn-danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.pp-btn-ghost {
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
.pp-btn-ghost:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* ─── Toolbar ──────────────────────────────────── */
.pp-toolbar {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.9rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pp-search-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 240px;
}

.pp-search-box {
  position: relative;
  flex: 1;
}

.pp-search-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.pp-search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.25rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}
.pp-search-input::placeholder { color: #94a3b8; }
.pp-search-input:focus {
  border-color: #007bff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.08);
}

.pp-search-btn {
  padding: 0.6rem 1.1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  font-family: inherit;
}
.pp-search-btn:hover { background: #0069d9; }

.pp-filters {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pp-filter-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 0.75rem;
  transition: border-color 0.2s;
}
.pp-filter-item:focus-within {
  border-color: #007bff;
}

.pp-filter-ico { color: #94a3b8; flex-shrink: 0; }

.pp-filter-select {
  border: none;
  background: transparent;
  font-size: 0.85rem;
  color: #475569;
  cursor: pointer;
  outline: none;
  padding: 0.6rem 0.25rem;
  font-family: inherit;
  min-width: 110px;
}

/* ─── Table card ───────────────────────────────── */
.pp-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.pp-table-wrap {
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.pp-table {
  width: 100%;
  border-collapse: collapse;
}

.pp-table th {
  background: #f8fafc;
  padding: 0.85rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
  white-space: nowrap;
  border-bottom: 1px solid #f1f5f9;
}

.pp-table td {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.875rem;
  color: #334155;
  vertical-align: middle;
}

.th-check, .pp-table td:first-child { width: 3rem; }
.th-actions { text-align: right; }

.pp-checkbox {
  width: 15px;
  height: 15px;
  accent-color: #007bff;
  cursor: pointer;
}

.pp-row {
  cursor: pointer;
  transition: background 0.12s;
}
.pp-row:hover td { background: #f8fafc; }
.pp-row:last-child td { border-bottom: none; }

.td-id { color: #94a3b8; font-size: 0.78rem; font-weight: 600; }
.td-cat { color: #64748b; }
.td-price { font-weight: 700; color: #0f172a; }
.currency { font-size: 0.72rem; font-weight: 500; color: #94a3b8; }
.td-qty { color: #475569; font-weight: 500; }

.pp-product-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pp-product-thumb {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(99,102,241,0.1));
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pp-product-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
}

.pp-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.pp-status-active {
  background: rgba(16,185,129,0.1);
  color: #059669;
  border: 1px solid rgba(16,185,129,0.2);
}
.pp-status-inactive {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.pp-actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.pp-act-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.pp-act-btn:hover {
  background: #f1f5f9;
  color: #007bff;
  border-color: rgba(0,123,255,0.3);
}
.pp-act-del:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* ─── Empty ─────────────────────────────────────── */
.pp-empty { text-align: center; padding: 3rem; }
.pp-empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: #94a3b8;
}
.pp-empty-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.pp-empty p { font-size: 0.875rem; margin: 0; }

/* ─── Pagination ────────────────────────────────── */
.pp-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pp-page-info {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.pp-page-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pp-page-btn {
  width: 30px;
  height: 30px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s;
}
.pp-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pp-page-btn:not(:disabled):hover {
  background: #f8fafc;
  border-color: #007bff;
  color: #007bff;
}

.pp-page-num {
  min-width: 32px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.2);
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #007bff;
  padding: 0 0.5rem;
}

/* ─── Skeleton ──────────────────────────────────── */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skel-row td { border-bottom: 1px solid #f8fafc; }
.skel-check { width: 15px; height: 15px; border-radius: 3px; }
.skel-img { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; }
.skel-name { width: 130px; height: 13px; }
.skel-cat { width: 72px; height: 12px; }
.skel-price { width: 96px; height: 12px; }
.skel-qty { width: 40px; height: 12px; }
.skel-badge { width: 58px; height: 20px; border-radius: 100px; }
.skel-act { width: 30px; height: 30px; border-radius: 8px; }

/* ─── Modal ─────────────────────────────────────── */
.pp-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9000;
}

.pp-modal {
  background: #fff;
  border-radius: 18px;
  padding: 2rem 1.75rem 1.5rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.pp-modal-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}
.del-icon {
  background: #fef2f2;
  color: #dc2626;
}

.pp-modal-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.pp-modal-text {
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.55;
}

.pp-modal-actions {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 768px) {
  .pp-hero { padding: 1.25rem; }
  .pp-title { font-size: 1.3rem; }
  .pp-toolbar { flex-direction: column; align-items: stretch; }
  .pp-search-wrap { min-width: 0; }
  .pp-filters { flex-wrap: wrap; }
  .pp-filter-select { min-width: 90px; }
  .pp-pagination { justify-content: center; flex-direction: column; align-items: center; }
}

@media (max-width: 640px) {
  .pp-table th,
  .pp-table td { padding: 0.7rem 0.85rem; }
  .pp-modal-actions { flex-direction: column-reverse; gap: 0.5rem; }
  .pp-modal-actions .pp-btn-ghost,
  .pp-modal-actions .pp-btn-danger { width: 100%; justify-content: center; }
}
</style>
