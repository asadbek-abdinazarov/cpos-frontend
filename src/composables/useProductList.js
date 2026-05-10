import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts, getCategories, deleteProduct, deleteProductsBatch } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from 'vue-i18n'
import { useDelayedLoading } from '@/composables/useDelayedLoading'

export function useProductList() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const { t } = useI18n()

  const products = ref([])
  const { loading, showSkeleton, startLoading, stopLoading } = useDelayedLoading()
  const totalElements = ref(0)
  const totalPages = ref(1)

  const searchQuery = ref('')
  const selectedCategory = ref('All')
  const selectedStatus = ref('All')

  const categories = ref([{ id: 'All', name: t('dashboard.products.status.all') }])
  const statuses = computed(() => [
    { value: 'All', label: t('dashboard.products.status.all') },
    { value: 'Active', label: t('dashboard.products.status.active') },
    { value: 'Inactive', label: t('dashboard.products.status.inactive') },
  ])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      if (res.data && res.data.success) {
        const fetchedCategories = res.data.data.map((c) => ({ id: c.id, name: c.name }))
        categories.value = [
          { id: 'All', name: t('dashboard.products.status.all') },
          ...fetchedCategories,
        ]
      }
    } catch {
      // category load failure is non-critical; list falls back to "All"
    }
  }

  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  function readFiltersFromQuery() {
    const query = router.currentRoute.value.query
    searchQuery.value = query.search || ''
    selectedCategory.value = query.category || 'All'
    selectedStatus.value = query.status || 'All'
    currentPage.value = parseInt(query.page) || 1
  }

  function pushFiltersToQuery() {
    const query = {}
    if (searchQuery.value) query.search = searchQuery.value
    if (selectedCategory.value !== 'All') query.category = selectedCategory.value
    if (selectedStatus.value !== 'All') query.status = selectedStatus.value
    if (currentPage.value > 1) query.page = currentPage.value
    router.replace({ query })
  }

  const fetchProducts = async () => {
    startLoading()
    try {
      const params = {
        page: currentPage.value - 1,
        size: itemsPerPage.value,
        sort: 'id,desc',
      }

      if (selectedCategory.value !== 'All') {
        params.categoryId = selectedCategory.value
      }

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
    } catch {
      // error shown by global API interceptor
    } finally {
      stopLoading()
    }
  }

  const onSearchSubmit = () => {
    currentPage.value = 1
    pushFiltersToQuery()
    fetchProducts()
  }

  watch(searchQuery, (newVal) => {
    if (newVal === '') {
      currentPage.value = 1
      pushFiltersToQuery()
      fetchProducts()
    }
  })

  watch([selectedCategory, selectedStatus], () => {
    currentPage.value = 1
    pushFiltersToQuery()
    fetchProducts()
  })

  const filteredProducts = computed(() => {
    return products.value
  })

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      pushFiltersToQuery()
      fetchProducts()
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      pushFiltersToQuery()
      fetchProducts()
    }
  }

  onMounted(async () => {
    readFiltersFromQuery()
    await fetchCategories()
    await fetchProducts()
  })

  function goToProductDetail(product) {
    router.push({ name: 'productDetail', params: { id: product.id } })
  }

  function goToProductEdit(product) {
    router.push({ name: 'productEdit', params: { id: product.id } })
  }

  function goToProductNew() {
    router.push({ name: 'productNew' })
  }

  const selectedProductIds = ref([])

  const isAllSelected = computed(() => {
    return (
      filteredProducts.value.length > 0 &&
      selectedProductIds.value.length === filteredProducts.value.length
    )
  })

  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      selectedProductIds.value = []
    } else {
      selectedProductIds.value = filteredProducts.value.map((p) => p.id)
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
    const deletedId = productToDelete.value.id
    try {
      const res = await deleteProduct(deletedId)
      if (res.data && res.data.success) {
        showNotification({ type: 'success', message: t('dashboard.products.deleted_success') })
        selectedProductIds.value = selectedProductIds.value.filter((id) => id !== deletedId)
        await fetchProducts()
      }
    } catch {
      // error shown by global API interceptor
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
        showNotification({
          type: 'success',
          message: t('dashboard.products.batch_delete_success', { count: selectedProductIds.value.length }),
        })
        selectedProductIds.value = []
        await fetchProducts()
      }
    } catch {
      // error shown by global API interceptor
    } finally {
      closeBatchDeleteModal()
    }
  }

  return {
    products,
    loading,
    showSkeleton,
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
    fetchProducts,
    pushFiltersToQuery,
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
  }
}
