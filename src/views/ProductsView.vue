<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-vue-next'

// Mock Data
const products = ref([
  { id: 1, name: 'Wireless Noise Cancelling Headphones', category: 'Electronics', price: 299.00, stock: 45, status: 'In Stock', image: '' },
  { id: 2, name: 'Ergonomic Office Chair', category: 'Furniture', price: 199.50, stock: 12, status: 'Low Stock', image: '' },
  { id: 3, name: 'Smartphone Stand', category: 'Accessories', price: 24.99, stock: 150, status: 'In Stock', image: '' },
  { id: 4, name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 129.00, stock: 0, status: 'Out of Stock', image: '' },
  { id: 5, name: 'USB-C Docking Station', category: 'Accessories', price: 89.99, stock: 30, status: 'In Stock', image: '' },
  { id: 6, name: '4K Monitor 27"', category: 'Electronics', price: 349.00, stock: 8, status: 'Low Stock', image: '' },
  { id: 7, name: 'Bluetooth Speaker', category: 'Electronics', price: 59.99, stock: 65, status: 'In Stock', image: '' },
  { id: 8, name: 'Laptop Sleeve 15"', category: 'Accessories', price: 35.00, stock: 200, status: 'In Stock', image: '' },
  { id: 9, name: 'Wireless Mouse', category: 'Electronics', price: 45.50, stock: 90, status: 'In Stock', image: '' },
  { id: 10, name: 'Webcam 1080p', category: 'Electronics', price: 69.00, stock: 25, status: 'In Stock', image: '' },
])

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedStatus = ref('All')

const categories = ['All', 'Electronics', 'Furniture', 'Accessories', 'Apparel']
const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock']

// Filtered Products
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value
    const matchesStatus = selectedStatus.value === 'All' || product.status === selectedStatus.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})

// Pagination (Mock)
const currentPage = ref(1)
const itemsPerPage = 8
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <div class="products-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Products</h1>
        <p class="text-subtitle">Manage your product catalog</p>
      </div>
      <button class="btn btn-primary">
        <Plus class="icon-sm" />
        Add Product
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar-card">
      <div class="search-box">
        <Search class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..." 
          class="search-input"
        />
      </div>
      
      <div class="filters">
        <div class="select-wrapper">
          <select v-model="selectedCategory" class="filter-select">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="select-wrapper">
          <select v-model="selectedStatus" class="filter-select">
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
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
              <th class="w-16"><input type="checkbox" /></th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td><input type="checkbox" /></td>
              <td>
                <div class="product-cell">
                  <div class="product-image">
                    <Package class="placeholder-icon" />
                  </div>
                  <span class="product-name">{{ product.name }}</span>
                </div>
              </td>
              <td>{{ product.category }}</td>
              <td class="font-medium">${{ product.price.toFixed(2) }}</td>
              <td>{{ product.stock }} units</td>
              <td>
                <span class="status-badge" :class="product.status.toLowerCase().replace(/ /g, '-')">
                  {{ product.status }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button class="action-btn" title="View"><Eye class="icon-xs" /></button>
                  <button class="action-btn" title="Edit"><Edit class="icon-xs" /></button>
                  <button class="action-btn delete" title="Delete"><Trash2 class="icon-xs" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="7" class="empty-state">
                No products found matching your filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-footer">
        <span class="pagination-info">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} of {{ filteredProducts.length }} entries
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
  color: #0F172A;
}

.text-subtitle {
  color: #64748B;
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
  background-color: #2563EB;
  color: white;
}

.btn-primary:hover {
  background-color: #1D4ED8;
}

.icon-sm { width: 18px; height: 18px; }
.icon-xs { width: 16px; height: 16px; }

/* Toolbar */
.toolbar-card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  width: 18px;
  height: 18px;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  color: #0F172A;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2563EB;
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.6rem 2rem 0.6rem 1rem;
  border: 1px solid #E2E8F0;
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
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 8px;
  color: #64748B;
}

/* Table Card */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  border-bottom: 1px solid #F1F5F9;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background-color: #F8FAFC;
  color: #64748B;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.data-table td {
  border-bottom: 1px solid #F1F5F9;
  color: #334155;
  font-size: 0.9rem;
}

.data-table tr:hover td {
  background-color: #F8FAFC;
}

.w-16 { width: 4rem; }
.text-right { text-align: right; }
.font-medium { font-weight: 600; color: #0F172A; }

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 40px;
  height: 40px;
  background-color: #F1F5F9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
}

.placeholder-icon {
  width: 20px;
  height: 20px;
}

.product-name {
  font-weight: 500;
  color: #0F172A;
}

/* Status Badges */
.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.in-stock { background-color: #DCFCE7; color: #16A34A; }
.status-badge.low-stock { background-color: #FEF3C7; color: #D97706; }
.status-badge.out-of-stock { background-color: #FEE2E2; color: #DC2626; }

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
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 6px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.1s;
}

.action-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
  border-color: #CBD5E1;
}

.action-btn.delete:hover {
  background: #FEF2F2;
  color: #DC2626;
  border-color: #FECACA;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748B;
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
  color: #64748B;
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
  border: 1px solid #E2E8F0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #64748B;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: #F8FAFC;
  color: #0F172A;
}

.current-page {
  font-size: 0.85rem;
  font-weight: 500;
  color: #0F172A;
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

  /* Table Adjustments for Mobile can be complex, currently rely on overflow-x */
  .pagination-footer {
    justify-content: center;
    flex-direction: column;
  }
}
</style>
