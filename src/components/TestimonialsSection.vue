<template>
  <section class="testimonials-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ t('testimonials.title') }}</h2>
        <p class="section-subtitle">{{ t('testimonials.subtitle') }}</p>
      </div>

      <div class="marquee-container">
        <div class="marquee-content">
          <!-- Duplicate logic for seamless infinite scroll -->
          <div class="testimonial-card" v-for="(item, index) in [...testimonials, ...testimonials]" :key="index">
            <div class="quote-icon-wrapper">
              <Quote class="quote-icon" />
            </div>
            <p class="quote-text">{{ item.quote }}</p>
            <div class="client-info">
              <div class="client-avatar">{{ item.name.charAt(0) }}</div>
              <div class="client-details">
                <h4 class="client-name">{{ item.name }}</h4>
                <p class="client-business">{{ item.business }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Quote } from 'lucide-vue-next'

const { t } = useI18n()

const testimonials = computed(() => [
  {
    quote: t('testimonials.list[0].quote'),
    name: t('testimonials.list[0].name'),
    business: t('testimonials.list[0].business')
  },
  {
    quote: t('testimonials.list[1].quote'),
    name: t('testimonials.list[1].name'),
    business: t('testimonials.list[1].business')
  },
  {
    quote: t('testimonials.list[2].quote'),
    name: t('testimonials.list[2].name'),
    business: t('testimonials.list[2].business')
  },
  // Add more items to make the marquee longer if needed
  {
    quote: t('testimonials.list[0].quote'),
    name: t('testimonials.list[0].name'),
    business: t('testimonials.list[0].business')
  }
])
</script>

<style scoped>
.testimonials-section {
  padding: 6rem 0;
  background-color: #FFFFFF;
  overflow: hidden; /* Hide scrollbar for the marquee */
}

.section-header {
  text-align: center;
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
  max-width: 600px;
  margin: 0 auto;
}

.marquee-container {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-content {
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.marquee-content:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* Move half the width (since we duplicated list) */
}

.testimonial-card {
  background: #F8FAFC;
  padding: 2rem;
  border-radius: 16px;
  min-width: 350px; /* Fixed width for consistent marquee items */
  max-width: 350px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
}

.quote-icon-wrapper {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: #E2E8F0;
}

.quote-icon {
  width: 3rem;
  height: 3rem;
  fill: currentColor;
}

.quote-text {
  font-size: 1.1rem;
  color: #334155;
  line-height: 1.6;
  margin-bottom: 2rem;
  padding-top: 2rem;
  position: relative;
  z-index: 1;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.client-avatar {
  width: 48px;
  height: 48px;
  background-color: #007BFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.client-name {
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.2rem;
  font-size: 1rem;
}

.client-business {
  font-size: 0.85rem;
  color: #64748B;
}

@media (max-width: 768px) {
  .testimonials-section {
    padding: 4rem 0;
  }
  
  .testimonial-card {
    min-width: 280px; /* Reduced width for smaller screens */
    max-width: 280px;
    padding: 1.5rem;
  }
  
  .quote-text {
    font-size: 1rem;
  }
}
</style>
