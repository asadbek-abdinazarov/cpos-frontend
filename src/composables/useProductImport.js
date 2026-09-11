import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { downloadProductImportTemplate, importProducts } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv']
const MAX_FILE_BYTES = 10 * 1024 * 1024

/** Bir xil javob shakli: dryRun ham, haqiqiy import ham shuni qaytaradi */
function normalizeResult(payload) {
  return {
    dryRun: !!payload?.dryRun,
    imported: payload?.imported ?? 0,
    totalRows: payload?.totalRows ?? 0,
    syncPending: !!payload?.syncPending,
  }
}

/**
 * Xato kalitlari "row.<Excel qator>.<ustun>" ko'rinishida keladi —
 * jadvalda ko'rsatish uchun qator raqami bo'yicha tartiblangan ro'yxatga aylantiriladi.
 */
function parseRowErrors(errors) {
  if (!errors || typeof errors !== 'object') return []
  return Object.entries(errors)
    .map(([key, message]) => {
      const [, row, ...rest] = key.split('.')
      const parsedRow = Number(row)
      return {
        key,
        row: Number.isFinite(parsedRow) ? parsedRow : null,
        column: rest.join('.') || '—',
        message,
      }
    })
    .sort((a, b) => (a.row ?? 0) - (b.row ?? 0) || a.column.localeCompare(b.column))
}

export function useProductImport() {
  const { t } = useI18n()
  const { showNotification } = useNotification()

  const file = ref(null)
  const templateLoading = ref(false)
  const checking = ref(false)
  const importing = ref(false)

  /** null | { dryRun, imported, totalRows, syncPending } */
  const result = ref(null)
  const rowErrors = ref([])
  const fatalMessage = ref('')

  const busy = computed(() => checking.value || importing.value)
  const hasErrors = computed(() => rowErrors.value.length > 0 || !!fatalMessage.value)
  /** Tekshiruv o'tgan — endi haqiqiy importga ruxsat */
  const canConfirm = computed(
    () => !!result.value?.dryRun && !hasErrors.value && !!file.value && !busy.value,
  )

  function resetFeedback() {
    result.value = null
    rowErrors.value = []
    fatalMessage.value = ''
  }

  function reset() {
    file.value = null
    resetFeedback()
  }

  function validateFile(candidate) {
    const name = (candidate?.name || '').toLowerCase()
    if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      return t('dashboard.products.import.error_format')
    }
    if (candidate.size > MAX_FILE_BYTES) {
      return t('dashboard.products.import.error_too_large')
    }
    if (candidate.size === 0) {
      return t('dashboard.products.import.error_empty')
    }
    return ''
  }

  function setFile(candidate) {
    resetFeedback()
    if (!candidate) {
      file.value = null
      return
    }
    const problem = validateFile(candidate)
    if (problem) {
      file.value = null
      fatalMessage.value = problem
      return
    }
    file.value = candidate
  }

  async function downloadTemplate() {
    if (templateLoading.value) return
    templateLoading.value = true
    try {
      const res = await downloadProductImportTemplate()
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'mahsulot-import-shablon.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      // error shown by global API interceptor
    } finally {
      templateLoading.value = false
    }
  }

  /** Xato javobini o'qiydi. Blob javoblar ham JSON bo'lishi mumkin. */
  async function readErrorPayload(error) {
    const data = error?.response?.data
    if (data instanceof Blob) {
      try {
        return JSON.parse(await data.text())
      } catch {
        return null
      }
    }
    return data ?? null
  }

  async function send(dryRun) {
    if (!file.value || busy.value) return false
    resetFeedback()
    const flag = dryRun ? checking : importing
    flag.value = true

    try {
      const res = await importProducts(file.value, { dryRun })
      result.value = normalizeResult(res.data?.data)
      if (!dryRun) {
        showNotification({
          type: 'success',
          message: t('dashboard.products.import.success', { count: result.value.imported }),
        })
      }
      return true
    } catch (error) {
      const payload = await readErrorPayload(error)
      const status = error?.response?.status

      rowErrors.value = parseRowErrors(payload?.errors)
      // Backend xabarni foydalanuvchi tiliga tarjima qilib yuboradi;
      // tarmoq uzilganda tayanadigan hech narsa bo'lmaydi.
      fatalMessage.value =
        payload?.message ||
        (status === 403
          ? t('dashboard.products.import.error_forbidden')
          : t('dashboard.products.import.error_generic'))

      if (!rowErrors.value.length) {
        showNotification({ type: 'error', message: fatalMessage.value })
      }
      return false
    } finally {
      flag.value = false
    }
  }

  const check = () => send(true)
  const confirmImport = () => send(false)

  return {
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
    acceptAttribute: ACCEPTED_EXTENSIONS.join(','),
    setFile,
    reset,
    downloadTemplate,
    check,
    confirmImport,
  }
}
