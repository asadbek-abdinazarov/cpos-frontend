<script setup>
import { ref, computed, watch } from 'vue'
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
  Package,
  AlertTriangle
} from 'lucide-vue-next'

import { getProducts, getCategories, deleteProduct, deleteProductsBatch, createProduct, updateProduct } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const products = ref([])
const loading = ref(false)
const totalElements = ref(0)
const totalPages = ref(1)

const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedStatus = ref('All')

// Categories and Statuses
const categories = ref([{ id: 'All', name: 'All' }])
const statuses = ['All', 'Active', 'Inactive']

const fetchCategories = async () => {
  try {
    const res = await getCategories()
    if (res.data && res.data.success) {
      const fetchedCategories = res.data.data.map(c => ({ id: c.id, name: c.name }))
      categories.value = [{ id: 'All', name: 'All' }, ...fetchedCategories]
    }
  } catch (error) {
    console.error('Failed to load categories', error)
  }
}

const currentPage = ref(1)
const itemsPerPage = ref(10)

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      sort: ['id']
    }

    // Backend filtering: categoryId
    if (selectedCategory.value !== 'All') {
      params.categoryId = selectedCategory.value
    }

    // Backend filtering: isActive
    if (selectedStatus.value === 'Active') {
      params.isActive = true
    } else if (selectedStatus.value === 'Inactive') {
      params.isActive = false
    }

    if (searchQuery.value) {
      params.value = searchQuery.value
    }

    const res = await getProducts(params)
    if (res.data && res.data.success) {
      products.value = res.data.data.content
      totalPages.value = res.data.data.page.totalPages === 0 ? 1 : res.data.data.page.totalPages
      totalElements.value = res.data.data.page.totalElements
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Trigger search on submit
const onSearchSubmit = () => {
  currentPage.value = 1
  fetchProducts()
}

// Auto-search if input is cleared
watch(searchQuery, (newVal) => {
  if (newVal === '') {
    currentPage.value = 1
    fetchProducts()
  }
})

const filteredProducts = computed(() => {
  return products.value
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchProducts()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProducts()
  }
}

import { onMounted } from 'vue'

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})

// Product Detail Modal
const selectedProduct = ref(null)
const isModalOpen = ref(false)

const openProductModal = (product) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const closeModal = () => {
  selectedProduct.value = null
  isModalOpen.value = false
}

// Deletion Logic
const selectedProductIds = ref([])

const isAllSelected = computed(() => {
  return filteredProducts.value.length > 0 && selectedProductIds.value.length === filteredProducts.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProductIds.value = []
  } else {
    selectedProductIds.value = filteredProducts.value.map(p => p.id)
  }
}

const isDeleteModalOpen = ref(false)
const productToDelete = ref(null)

const confirmDelete = (product) => {
  productToDelete.value = product
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  productToDelete.value = null
  isDeleteModalOpen.value = false
}

const executeDelete = async () => {
  if (!productToDelete.value) return
  try {
    const res = await deleteProduct(productToDelete.value.id)
    if (res.data && res.data.success) {
      showNotification({ type: 'success', message: 'Product deleted successfully' })
      selectedProductIds.value = selectedProductIds.value.filter(id => id !== productToDelete.value.id)
      await fetchProducts()
    }
  } catch (err) {
    console.error(err)
  } finally {
    closeDeleteModal()
  }
}

const isBatchDeleteModalOpen = ref(false)

const confirmBatchDelete = () => {
  if (selectedProductIds.value.length === 0) return
  isBatchDeleteModalOpen.value = true
}

const closeBatchDeleteModal = () => {
  isBatchDeleteModalOpen.value = false
}

const executeBatchDelete = async () => {
  if (selectedProductIds.value.length === 0) return
  try {
    const res = await deleteProductsBatch(selectedProductIds.value)
    if (res.data && res.data.success) {
      showNotification({ type: 'success', message: `${selectedProductIds.value.length} products deleted successfully` })
      selectedProductIds.value = []
      await fetchProducts()
    }
  } catch (err) {
    console.error(err)
  } finally {
    closeBatchDeleteModal()
  }
}

// Add / Edit Product Logic
const isAddModalOpen = ref(false)
const addingProduct = ref(false)
const isEditMode = ref(false)
const editingProductId = ref(null)
const originalProduct = ref(null)

const newProduct = ref({
  name: '',
  description: '',
  barcode: '',
  sku: '',
  price: 0,
  cost: 0,
  unit: 'PIECE',
  isWeighable: false,
  isActive: true,
  categoryId: null
})

const units = ['PIECE', 'KG', 'LITER', 'METER', 'BOX']

const openAddModal = () => {
  isEditMode.value = false
  editingProductId.value = null
  newProduct.value = {
    name: '',
    description: '',
    barcode: '',
    sku: '',
    price: 0,
    cost: 0,
    unit: 'PIECE',
    isWeighable: false,
    isActive: true,
    categoryId: categories.value.length > 1 ? categories.value[1].id : 0
  }
  isAddModalOpen.value = true
}

const openEditModal = (product) => {
  isEditMode.value = true
  editingProductId.value = product.id
  
  const mapped = {
    name: product.name || '',
    description: product.description || '',
    barcode: product.barcode || '',
    sku: product.sku || '',
    price: product.price || 0,
    cost: product.cost || 0,
    unit: product.unit || 'PIECE',
    isWeighable: !!product.isWeighable,
    isActive: !!product.isActive,
    categoryId: product.category ? product.category.id : 0
  }
  
  newProduct.value = { ...mapped }
  originalProduct.value = { ...mapped }
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
}

const submitNewProduct = async () => {
  addingProduct.value = true
  try {
    let res
    if (isEditMode.value) {
      const patchData = {}
      for (const key in newProduct.value) {
        if (newProduct.value[key] !== originalProduct.value[key]) {
          patchData[key] = newProduct.value[key]
        }
      }
      
      if (Object.keys(patchData).length === 0) {
        showNotification({ type: 'info', message: 'No changes detected' })
        closeAddModal()
        addingProduct.value = false
        return
      }
      
      res = await updateProduct(editingProductId.value, patchData)
    } else {
      res = await createProduct(newProduct.value)
    }

    if (res.data && res.data.success) {
      showNotification({ 
        type: 'success', 
        message: isEditMode.value ? 'Product updated successfully' : 'Product added successfully' 
      })
      closeAddModal()
      if (!isEditMode.value) {
        currentPage.value = 1 // reset to first page to see the new product
      }
      await fetchProducts()
    }
  } catch (err) {
    console.error(err)
  } finally {
    addingProduct.value = false
  }
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
      <div class="header-actions">
        <button 
          v-if="selectedProductIds.length > 0" 
          class="btn btn-danger" 
          @click="confirmBatchDelete"
        >
          <Trash2 class="icon-sm" />
          Delete Selected ({{ selectedProductIds.length }})
        </button>
        <button class="btn btn-primary" @click="openAddModal">
          <Plus class="icon-sm" />
          Add Product
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
            placeholder="Search products..." 
            class="search-input"
          />
        </div>
        <button type="submit" class="btn btn-primary search-btn">Search</button>
      </form>
      
      <div class="filters">
        <div class="select-wrapper">
          <select v-model="selectedCategory" class="filter-select">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
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
              <th class="w-16"><input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" /></th>
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
                <td><div class="skel" style="width: 30px; height: 13px;"></div></td>
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
                <td><div style="display:flex;gap:0.5rem;justify-content:flex-end"><div class="skel skel-action"></div><div class="skel skel-action"></div><div class="skel skel-action"></div></div></td>
              </tr>
            </template>
            <tr v-else v-for="product in filteredProducts" :key="product.id">
              <td><input type="checkbox" :value="product.id" v-model="selectedProductIds" /></td>
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
              <td>{{ product.sku }}</td>
              <td>
                <span class="status-badge" :class="product.isActive ? 'in-stock' : 'out-of-stock'">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button class="action-btn" title="View" @click="openProductModal(product)"><Eye class="icon-xs" /></button>
                  <button class="action-btn" title="Edit" @click="openEditModal(product)"><Edit class="icon-xs" /></button>
                  <button class="action-btn delete" title="Delete" @click="confirmDelete(product)"><Trash2 class="icon-xs" /></button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && filteredProducts.length === 0">
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
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalElements) }} of {{ totalElements }} entries
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

    <!-- Product Detail Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content card">
        <div class="modal-header">
          <h2>Product Details</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedProduct">
          <div class="product-detail-grid">
            <div class="detail-group">
              <label>Name</label>
              <p>{{ selectedProduct.name }}</p>
            </div>
            <div class="detail-group">
              <label>Category</label>
              <p>{{ selectedProduct.category ? selectedProduct.category.name : '—' }}</p>
            </div>
            <div class="detail-group">
              <label>Price</label>
              <p class="font-medium highlight">{{ selectedProduct.price.toLocaleString('uz-UZ') }} UZS</p>
            </div>
            <div class="detail-group">
              <label>Cost</label>
              <p>{{ selectedProduct.cost.toLocaleString('uz-UZ') }} UZS</p>
            </div>
            <div class="detail-group">
              <label>Barcode</label>
              <p class="mono-text">{{ selectedProduct.barcode || '—' }}</p>
            </div>
            <div class="detail-group">
              <label>SKU</label>
              <p class="mono-text">{{ selectedProduct.sku || '—' }}</p>
            </div>
            <div class="detail-group">
              <label>Unit</label>
              <p>{{ selectedProduct.unit }}</p>
            </div>
            <div class="detail-group">
              <label>Weighable</label>
              <p>{{ selectedProduct.isWeighable ? 'Yes' : 'No' }}</p>
            </div>
            <div class="detail-group">
              <label>Status</label>
              <span class="status-badge" :class="selectedProduct.isActive ? 'in-stock' : 'out-of-stock'">
                {{ selectedProduct.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="detail-group col-span-2">
              <label>Description</label>
              <p class="description-text">{{ selectedProduct.description || 'No description provided.' }}</p>
            </div>
             <div class="detail-group">
              <label>Created At</label>
              <p class="text-subtle">{{ selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
             <div class="detail-group">
              <label>Updated At</label>
              <p class="text-subtle">{{ selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="closeModal">Close</button>
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
            Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>? <br/>
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
            Are you sure you want to delete <strong>{{ selectedProductIds.length }}</strong> products? <br/>
            This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer justify-center">
          <button class="btn btn-secondary" @click="closeBatchDeleteModal">Cancel</button>
          <button class="btn btn-danger" @click="executeBatchDelete">Delete All</button>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content card">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h2>
          <button class="close-btn" @click="closeAddModal">&times;</button>
        </div>
        <div class="modal-body product-detail-grid">
          <div class="data-group col-span-2">
            <label>Product Name</label>
            <input type="text" v-model="newProduct.name" class="premium-input" placeholder="e.g. Qora Zira" />
          </div>
          
          <div class="data-group">
            <label>Category</label>
            <select v-model="newProduct.categoryId" class="premium-input select">
              <optgroup label="Select Category">
                <!-- Skip the 'All' category which is at index 0 -->
                <option v-for="cat in categories.slice(1)" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </optgroup>
            </select>
          </div>
          
          <div class="data-group">
            <label>Unit</label>
            <select v-model="newProduct.unit" class="premium-input select">
              <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          
          <div class="data-group">
            <label>Cost (UZS)</label>
            <input type="number" v-model="newProduct.cost" class="premium-input" placeholder="0" />
          </div>
          
          <div class="data-group">
            <label>Selling Price (UZS)</label>
            <input type="number" v-model="newProduct.price" class="premium-input" placeholder="0" />
          </div>

          <div class="data-group">
            <label>Barcode</label>
            <input type="text" v-model="newProduct.barcode" class="premium-input mono-text" placeholder="Scanning..." />
          </div>
          
          <div class="data-group">
            <label>SKU (Stock Keeping Unit)</label>
            <input type="text" v-model="newProduct.sku" class="premium-input mono-text" placeholder="Internal ID" />
          </div>
          
          <div class="data-group toggle-group">
            <label>Is Weighable?</label>
            <div class="toggle-switch" @click="newProduct.isWeighable = !newProduct.isWeighable" :class="{ 'active': newProduct.isWeighable }">
              <div class="toggle-knob"></div>
            </div>
          </div>
          
          <div class="data-group toggle-group">
            <label>Is Active?</label>
            <div class="toggle-switch" @click="newProduct.isActive = !newProduct.isActive" :class="{ 'active': newProduct.isActive }">
              <div class="toggle-knob"></div>
            </div>
          </div>

          <div class="data-group col-span-2">
            <label>Description (Optional)</label>
            <textarea v-model="newProduct.description" class="premium-input" placeholder="Brief details abut this product" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" style="margin-right: 1rem;" @click="closeAddModal">Cancel</button>
          <button class="btn btn-primary" @click="submitNewProduct" :disabled="addingProduct">
            {{ addingProduct ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Product' : 'Save Product') }}
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

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0F172A;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748B;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #0F172A;
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

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-group label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #94A3B8;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.detail-group p {
  margin: 0;
  color: #1E293B;
  font-size: 1rem;
}

.detail-group .highlight {
  color: #2563EB;
  font-size: 1.1rem;
}

.detail-group .mono-text {
  font-family: 'Courier New', Courier, monospace;
}

.detail-group .text-subtle {
  color: #64748B;
}

.description-text {
  background: #F8FAFC;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-size: 0.95rem !important;
  color: #475569 !important;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #F1F5F9;
  display: flex;
  justify-content: flex-end;
}

/* Delete Modals & Buttons */
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-danger {
  background-color: #FEF2F2;
  color: #DC2626;
}

.btn-danger:hover {
  background-color: #FEE2E2;
}

.btn-secondary {
  background-color: #F1F5F9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #E2E8F0;
  color: #0F172A;
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
  background-color: #FEF2F2;
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
  color: #DC2626;
}

.modal-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #0F172A;
}

.modal-text {
  margin: 0;
  color: #64748B;
  line-height: 1.5;
}

/* Form Elements */
.premium-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  color: #0F172A;
  transition: all 0.2s;
  background-color: white;
  box-sizing: border-box;
}

.premium-input:focus {
  border-color: #2563EB;
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
  background-color: #E2E8F0;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-switch.active {
  background-color: #2563EB;
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
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.toggle-switch.active .toggle-knob {
  transform: translateX(20px);
}

/* ── Skeleton loaders ── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skel-row td { border-bottom: 1px solid #F1F5F9; }
.skel-check    { width: 16px;  height: 16px; border-radius: 3px; }
.skel-img      { width: 40px;  height: 40px; border-radius: 8px; flex-shrink: 0; }
.skel-name     { width: 140px; height: 14px; }
.skel-cat      { width: 80px;  height: 13px; }
.skel-price    { width: 100px; height: 13px; }
.skel-sku      { width: 70px;  height: 13px; }
.skel-badge-xs { width: 60px;  height: 20px; border-radius: 9999px; }
.skel-action   { width: 28px;  height: 28px; border-radius: 6px; }
</style>
