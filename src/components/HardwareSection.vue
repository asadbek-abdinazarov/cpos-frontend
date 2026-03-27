
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { ArrowRight } from 'lucide-vue-next'
import terminalImg from '@/assets/images/terminal.png'
import printerImg from '@/assets/images/printer.png'
import scannerImg from '@/assets/images/scanner.png'

const { t } = useI18n()
const router = useRouter()

const goCatalog = () => goToHomeSection(router, 'catalog')

const products = computed(() => [
  {
    id: 1,
    title: t('hardware.products.terminal.title'),
    description: t('hardware.products.terminal.desc'),
    price: '$499',
    image: terminalImg
  },
  {
    id: 2,
    title: t('hardware.products.printer.title'),
    description: t('hardware.products.printer.desc'),
    price: '$120',
    image: printerImg
  },
  {
    id: 3,
    title: t('hardware.products.scanner.title'),
    description: t('hardware.products.scanner.desc'),
    price: '$85',
    image: scannerImg
  }
])
</script>

<template>
  <section class="hardware-section" id="hardware">
    <div class="container">
      <div class="section-header">
        <div class="header-text">
          <h2 class="section-title">{{ t('hardware.title') }}</h2>
          <p class="section-subtitle">{{ t('hardware.subtitle') }}</p>
        </div>
        <a href="/" class="view-catalog" @click.prevent="goCatalog"
          >{{ t('hardware.view_catalog') }} <ArrowRight class="icon-sm"
        /></a>
      </div>

      <div id="catalog" class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="image-wrapper">
             <img :src="product.image" :alt="product.title" class="product-image" loading="lazy" />
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-footer">
              <span class="product-price">{{ product.price }}</span>
              <button class="btn-quote">{{ t('hardware.request_quote') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hardware-section {
  padding: 6rem 0;
  background-color: var(--color-white);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748B;
  max-width: 500px;
  line-height: 1.6;
}

.view-catalog {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.view-catalog:hover {
  transform: translateX(5px);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.product-card {
  background-color: #F8FAFC;
  border-radius: 20px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.image-wrapper {
  background-color: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  /* aspect-ratio: 1; if creating square images */
  height: 250px;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  margin-top: auto;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.75rem;
}

.product-desc {
  font-size: 0.95rem;
  color: #64748B;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
}

.btn-quote {
  background-color: #E2E8F0;
  color: #0F172A;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-quote:hover {
  background-color: #CBD5E1;
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hardware-section {
    padding: 4rem 0;
  }
}

@media (max-width: 600px) {
  .section-header {
    flex-direction: column;
    align-items: center; /* Centered */
    text-align: center;
    gap: 1.5rem;
  }
  
  .header-text {
    width: 100%;
  }

  .section-subtitle {
    margin: 0 auto;
  }

  .view-catalog {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #F1F5F9;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
