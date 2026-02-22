<template>
  <section class="faq-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ t('faq.title') }}</h2>
        <p class="section-subtitle">{{ t('faq.subtitle') }}</p>
      </div>

      <div class="faq-grid">
        <div 
          class="faq-item" 
          v-for="(item, index) in faqList" 
          :key="index"
          @click="toggleFaq(index)"
          :class="{ 'active': activeIndex === index }"
        >
          <div class="faq-question">
            <h3>{{ item.question }}</h3>
            <span class="toggle-icon">
              <component :is="activeIndex === index ? ChevronUp : ChevronDown" />
            </span>
          </div>
          <div class="faq-answer-wrapper" :class="{ 'is-open': activeIndex === index }">
            <div class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const { t } = useI18n()
const activeIndex = ref(null)

const toggleFaq = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

const faqList = computed(() => [
  { question: t('faq.list[0].q'), answer: t('faq.list[0].a') },
  { question: t('faq.list[1].q'), answer: t('faq.list[1].a') },
  { question: t('faq.list[2].q'), answer: t('faq.list[2].a') },
  { question: t('faq.list[3].q'), answer: t('faq.list[3].a') }
])
</script>

<style scoped>
.faq-section {
  padding: 6rem 0;
  background-color: #F8FAFC;
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

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  cursor: pointer;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #007BFF;
}

.faq-item.active {
  border-color: #007BFF;
  box-shadow: 0 4px 6px -1px rgba(0, 123, 255, 0.1);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0F172A;
  margin: 0;
}

.toggle-icon {
  font-size: 1.5rem;
  color: #007BFF;
  font-weight: 300;
}

.faq-answer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
}

.faq-answer-wrapper.is-open {
  grid-template-rows: 1fr;
}

.faq-answer {
  overflow: hidden;
}

.faq-answer p {
  margin-top: 1rem;
  color: #64748B;
  line-height: 1.6;
  border-top: 1px solid #F1F5F9;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .faq-section {
    padding: 4rem 0;
  }
  
  .faq-item {
    padding: 1rem;
  }
  
  .question-text {
    font-size: 1rem;
  }
}
</style>
