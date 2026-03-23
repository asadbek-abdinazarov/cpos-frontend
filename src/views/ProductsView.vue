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
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('dashboard.products.title') }}</h1>
        <p class="text-subtitle">{{ $t('dashboard.products.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <button
          v-if="selectedProductIds.length > 0"
          class="btn btn-danger"
          @click="confirmBatchDelete"
        >
          <Trash2 class="icon-sm" />
          {{ $t('dashboard.products.delete_selected') }} ({{ selectedProductIds.length }})
        </button>
        <button class="btn btn-primary" @click="goToProductNew">
          <Plus class="icon-sm" />
          {{ $t('dashboard.products.add_product') }}
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar-card">
      <form @submit.prevent="onSearchSubmit" class="search-form">
        <div class="search-box">
          <Search class="search-icon" />
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('dashboard.products.search_placeholder')"
            class="search-input"
          />
        </div>
        <button type="submit" class="btn btn-primary search-btn">
          {{ $t('dashboard.products.search_btn') }}
        </button>
      </form>

      <div class="filters">
        <div class="select-wrapper">
          <select v-model="selectedCategory" class="filter-select">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <div class="select-wrapper">
          <select v-model="selectedStatus" class="filter-select">
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
        <button class="btn btn-icon-only filter-btn-mobile">
          <Filter class="icon-sm" />
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="card table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-16">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
              </th>
              <th>ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="n in itemsPerPage" :key="n" class="skel-row">
                <td><div class="skel skel-check"></div></td>
                <td><div class="skel" style="width: 30px; height: 13px"></div></td>
                <td>
                  <div class="product-cell">
                    <div class="skel skel-img"></div>
                    <div class="skel skel-name"></div>
                  </div>
                </td>
                <td><div class="skel skel-cat"></div></td>
                <td><div class="skel skel-price"></div></td>
                <td><div class="skel skel-sku"></div></td>
                <td><div class="skel skel-badge-xs"></div></td>
                <td>
                  <div style="display: flex; gap: 0.5rem; justify-content: flex-end">
                    <div class="skel skel-action"></div>
                    <div class="skel skel-action"></div>
                    <div class="skel skel-action"></div>
                  </div>
                </td>
              </tr>
            </template>
            <tr
              v-else
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-row"
              @click="goToProductDetail(product)"
            >
              <td @click.stop>
                <input type="checkbox" :value="product.id" v-model="selectedProductIds" />
              </td>
              <td>{{ product.id }}</td>
              <td>
                <div class="product-cell">
                  <div class="product-image">
                    <Package class="placeholder-icon" />
                  </div>
                  <span class="product-name">{{ product.name }}</span>
                </div>
              </td>
              <td>{{ product.category ? product.category.name : '—' }}</td>
              <td class="font-medium">{{ product.price.toLocaleString('uz-UZ') }} UZS</td>
              <td>{{ product.quantity }}</td>
              <td>
                <span class="status-badge" :class="product.isActive ? 'in-stock' : 'out-of-stock'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td @click.stop>
                <div class="actions-cell">
                  <button class="action-btn" title="View" @click.stop="goToProductDetail(product)">
                    <Eye class="icon-xs" />
                  </button>
                  <button class="action-btn" title="Edit" @click.stop="goToProductEdit(product)">
                    <Edit class="icon-xs" />
                  </button>
                  <button class="action-btn delete" title="Delete" @click.stop="confirmDelete(product)">
                    <Trash2 class="icon-xs" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && filteredProducts.length === 0">
              <td colspan="8" class="empty-state">No products found matching your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-footer">
        <span class="pagination-info">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, totalElements) }} of {{ totalElements }} entries
        </span>
        <div class="pagination-controls">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
            <ChevronLeft class="icon-xs" />
          </button>
          <span class="current-page">Page {{ currentPage }}</span>
          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <ChevronRight class="icon-xs" />
          </button>
        </div>
      </div>
    </div>

    <!-- Single Delete Modal -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content card delete-modal">
        <div class="modal-body text-center">
          <div class="warning-icon-wrapper">
            <AlertTriangle class="icon-xl text-danger" />
          </div>
          <h2 class="modal-title">Delete Product</h2>
          <p class="modal-text">
            Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong
            >? <br />
            This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer justify-center">
          <button class="btn btn-secondary" @click="closeDeleteModal">Cancel</button>
          <button class="btn btn-danger" @click="executeDelete">Delete</button>
        </div>
      </div>
    </div>

    <!-- Batch Delete Modal -->
    <div v-if="isBatchDeleteModalOpen" class="modal-overlay" @click.self="closeBatchDeleteModal">
      <div class="modal-content card delete-modal">
        <div class="modal-body text-center">
          <div class="warning-icon-wrapper">
            <AlertTriangle class="icon-xl text-danger" />
          </div>
          <h2 class="modal-title">Delete Multiple Products</h2>
          <p class="modal-text">
            Are you sure you want to delete
            <strong>{{ selectedProductIds.length }}</strong> products? <br />
            This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer justify-center">
          <button class="btn btn-secondary" @click="closeBatchDeleteModal">Cancel</button>
          <button class="btn btn-danger" @click="executeBatchDelete">Delete All</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.text-subtitle {
  color: #64748b;
  font-size: 0.9rem;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.icon-sm {
  width: 18px;
  height: 18px;
}
.icon-xs {
  width: 16px;
  height: 16px;
}

/* Toolbar */
.toolbar-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-form {
  display: flex;
  flex: 1;
  gap: 0.5rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-btn {
  padding: 0.6rem 1.2rem;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  width: 18px;
  height: 18px;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  color: #0f172a;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.6rem 2rem 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  color: #475569;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

.filter-btn-mobile {
  display: none;
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  color: #64748b;
}

/* Table Card */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #f1f5f9;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.data-table td {
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.9rem;
}

.data-table tr:hover td {
  background-color: #f8fafc;
}

.product-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.product-row:hover td {
  background-color: #f1f5f9;
}

.w-16 {
  width: 4rem;
}
.text-right {
  text-align: right;
}
.font-medium {
  font-weight: 600;
  color: #0f172a;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 40px;
  height: 40px;
  background-color: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.placeholder-icon {
  width: 20px;
  height: 20px;
}

.product-name {
  font-weight: 500;
  color: #0f172a;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.in-stock {
  background-color: #dcfce7;
  color: #16a34a;
}
.status-badge.low-stock {
  background-color: #fef3c7;
  color: #d97706;
}
.status-badge.out-of-stock {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Actions */
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.1s;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

/* Pagination */
.pagination-footer {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.85rem;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: #f8fafc;
  color: #0f172a;
}

.current-page {
  font-size: 0.85rem;
  font-weight: 500;
  color: #0f172a;
  margin: 0 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .toolbar-card {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    justify-content: space-between;
  }

  .filter-select {
    width: 100%;
  }

  .data-table th,
  .data-table td {
    padding: 0.65rem 0.75rem;
    font-size: 0.8125rem;
  }

  .pagination-footer {
    justify-content: center;
    flex-direction: column;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Product Detail Modal */
.modal-detail {
  max-width: 560px;
}

.detail-header {
  padding: 1.5rem 1.5rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
}

.detail-hero {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  min-width: 0;
}

.detail-hero-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-hero .icon-hero {
  width: 28px;
  height: 28px;
}

.detail-hero-text {
  min-width: 0;
}

.detail-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  word-break: break-word;
}

.detail-meta {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #64748b;
}

.detail-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.detail-section .product-detail-grid {
  gap: 1rem;
}

/* Add/Edit Product Modal */
.modal-form {
  max-width: 560px;
}

.form-header h2 {
  font-size: 1.25rem;
}

.form-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.form-grid {
  gap: 1rem;
}

.form-section .data-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-section .data-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #0f172a;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.product-detail-grid .col-span-2,
.form-grid .col-span-2 {
  grid-column: span 2;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-group label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.detail-group p {
  margin: 0;
  color: #1e293b;
  font-size: 1rem;
}

.detail-group .highlight {
  color: #2563eb;
  font-size: 1.1rem;
}

.detail-group .mono-text {
  font-family: 'Courier New', Courier, monospace;
}

.detail-group .text-subtle {
  color: #64748b;
}

.description-text {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem !important;
  color: #475569 !important;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Delete Modals & Buttons */
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-danger {
  background-color: #fef2f2;
  color: #dc2626;
}

.btn-danger:hover {
  background-color: #fee2e2;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.delete-modal {
  max-width: 400px;
}

.text-center {
  text-align: center;
}

.justify-center {
  justify-content: center;
  gap: 1rem;
}

.warning-icon-wrapper {
  background-color: #fef2f2;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.icon-xl {
  width: 32px;
  height: 32px;
}

.text-danger {
  color: #dc2626;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.modal-text {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

/* Form Elements */
.premium-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  color: #0f172a;
  transition: all 0.2s;
  background-color: white;
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

/* Toggle Switch */
.toggle-group {
  display: flex;
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
  background-color: white;
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

/* ── Skeleton loaders ── */
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skel-row td {
  border-bottom: 1px solid #f1f5f9;
}
.skel-check {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}
.skel-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
}
.skel-name {
  width: 140px;
  height: 14px;
}
.skel-cat {
  width: 80px;
  height: 13px;
}
.skel-price {
  width: 100px;
  height: 13px;
}
.skel-sku {
  width: 70px;
  height: 13px;
}
.skel-badge-xs {
  width: 60px;
  height: 20px;
  border-radius: 9999px;
}
.skel-action {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}
</style>
