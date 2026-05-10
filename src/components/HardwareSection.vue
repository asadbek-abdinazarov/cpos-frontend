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
    image: terminalImg,
    badge: t('hardware.badge.bestseller'),
    badgeColor: '#007BFF',
  },
  {
    id: 2,
    title: t('hardware.products.printer.title'),
    description: t('hardware.products.printer.desc'),
    price: '$120',
    image: printerImg,
    badge: t('hardware.badge.fast_delivery'),
    badgeColor: '#10B981',
  },
  {
    id: 3,
    title: t('hardware.products.scanner.title'),
    description: t('hardware.products.scanner.desc'),
    price: '$85',
    image: scannerImg,
    badge: t('hardware.badge.compact'),
    badgeColor: '#6366F1',
  },
])
</script>

<template>
  <section class="hardware-section" id="hardware">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <div class="head-left">
          <span class="section-tag">{{ t('hardware.section_tag') }}</span>
          <h2 class="section-title">{{ t('hardware.title') }}</h2>
          <p class="section-sub">{{ t('hardware.subtitle') }}</p>
        </div>
        <a href="/" class="view-all-link" @click.prevent="goCatalog">
          {{ t('hardware.view_catalog') }}
          <ArrowRight :size="16" :stroke-width="2.5" />
        </a>
      </div>

      <div id="catalog" class="product-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
          data-aos="fade-up"
          :data-aos-delay="(product.id - 1) * 100"
        >
          <div class="image-area">
            <img :src="product.image" :alt="product.title" class="product-img" loading="lazy" />
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-footer">
              <div class="price-wrap">
                <span class="price-from">{{ t('hardware.price_from') }}</span>
                <span class="product-price">{{ product.price }}</span>
              </div>
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
  padding: 7rem 0;
  background: #fff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3.5rem;
  gap: 2rem;
}

.head-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-tag {
  display: inline-block;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.15);
  color: #007bff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 100px;
  width: fit-content;
}

.section-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0;
}

.section-sub {
  font-size: 1.05rem;
  color: #64748b;
  max-width: 480px;
  line-height: 1.7;
  margin: 0;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #007bff;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1.5px solid rgba(0, 123, 255, 0.2);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.view-all-link:hover {
  background: rgba(0, 123, 255, 0.05);
  border-color: rgba(0, 123, 255, 0.4);
  gap: 10px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.product-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.image-area {
  background: #f1f5f9;
  border-radius: 14px;
  margin: 1rem 1rem 0;
  height: 210px;
  position: relative;
  overflow: hidden;
}

.product-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 78%;
  height: 90%;
  object-fit: contain;
  object-position: bottom center;
  transition: transform 0.4s ease;
}

.product-card:hover .product-img {
  transform: translateX(-50%) translateY(-8px) scale(1.04);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.product-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  flex: 1;
  margin-bottom: 1.5rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-from {
  font-size: 0.75rem;
  color: #94a3b8;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
}

.btn-quote {
  background: #0f172a;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-quote:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hardware-section {
    padding: 5rem 0;
  }
}

@media (max-width: 600px) {
  .section-head {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2.5rem;
  }

  .view-all-link {
    align-self: stretch;
    justify-content: center;
    min-height: 44px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-sub {
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .section-container { padding: 0 1.25rem; }
  .hardware-section { padding: 4rem 0; }
  .section-head { margin-bottom: 2rem; }
  .image-area { height: 180px; }
  .product-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .btn-quote {
    width: 100%;
    min-height: 44px;
    font-size: 0.9rem;
  }
}
</style>
