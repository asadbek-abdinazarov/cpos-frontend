<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  /** Optional: barcode bar height in pixels (e.g. for small label previews) */
  height: {
    type: Number,
    default: 48,
  },
  /** Optional: font size for the value below the barcode */
  fontSize: {
    type: Number,
    default: 18,
  },
})

const barcodeRef = ref(null)

function renderBarcode() {
  const val = (props.value || '').trim()
  if (!val || !barcodeRef.value) return
  try {
    barcodeRef.value.innerHTML = ''
    JsBarcode(barcodeRef.value, val, {
      format: 'CODE128',
      width: 1.5,
      height: props.height,
      displayValue: true,
      margin: 8,
      fontOptions: '',
      fontSize: props.fontSize,
    })
  } catch (e) {
    console.warn('JsBarcode render failed:', e)
  }
}

onMounted(() => {
  nextTick(renderBarcode)
})

watch(
  () => [props.value, props.height, props.fontSize],
  () => nextTick(renderBarcode),
  { immediate: false }
)
</script>

<template>
  <div v-if="(value || '').trim()" class="barcode-code128">
    <svg ref="barcodeRef" class="barcode-svg"></svg>
  </div>
</template>

<style scoped>
.barcode-code128 {
  display: inline-block;
  padding: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 8px;
}

.barcode-svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
