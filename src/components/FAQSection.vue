<template>
  <section class="faq-section">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">FAQ</span>
        <h2 class="section-title">{{ t('faq.title') }}</h2>
        <p class="section-sub">{{ t('faq.subtitle') }}</p>
      </div>

      <div class="faq-list" data-aos="fade-up" data-aos-delay="80">
        <div
          class="faq-item"
          v-for="(item, index) in faqList"
          :key="index"
          :class="{ active: activeIndex === index }"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <span class="q-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="q-text">{{ item.question }}</h3>
            <span class="q-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline v-if="activeIndex === index" points="18 15 12 9 6 15"/>
                <polyline v-else points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
          <div class="faq-answer-wrap" :class="{ open: activeIndex === index }">
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

const { t } = useI18n()
const activeIndex = ref(0)

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
  padding: 7rem 0;
  background: #fff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-head {
  text-align: center;
  margin-bottom: 4rem;
}

.section-tag {
  display: inline-block;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.18);
  color: #D97706;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-sub {
  font-size: 1.1rem;
  color: #64748B;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* FAQ list */
.faq-list {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq-item {
  border-bottom: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.faq-item:first-child {
  border-top: 1px solid #F1F5F9;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0;
  user-select: none;
}

.q-num {
  font-size: 0.72rem;
  font-weight: 700;
  color: #CBD5E1;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  width: 24px;
}

.faq-item.active .q-num {
  color: #007BFF;
}

.q-text {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  line-height: 1.4;
  transition: color 0.2s;
}

.faq-item.active .q-text {
  color: #007BFF;
}

.q-icon {
  color: #94A3B8;
  flex-shrink: 0;
  transition: color 0.2s;
}

.faq-item.active .q-icon {
  color: #007BFF;
}

/* Answer */
.faq-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.faq-answer-wrap.open {
  grid-template-rows: 1fr;
}

.faq-answer {
  overflow: hidden;
}

.faq-answer p {
  padding: 0 0 1.5rem 2.5rem;
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 640px) {
  .faq-section { padding: 5rem 0; }
  .q-text { font-size: 0.95rem; }
  .faq-answer p { padding-left: 0; }
  .q-num { display: none; }
}
</style>
