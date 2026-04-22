<template>
  <section class="testimonials-section">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">Mijozlar fikri</span>
        <h2 class="section-title">{{ t('testimonials.title') }}</h2>
        <p class="section-sub">{{ t('testimonials.subtitle') }}</p>
      </div>

      <div class="marquee-outer">
        <div class="marquee-track">
          <template v-if="!loading && testimonials.length > 0">
            <div
              class="testimonial-card"
              v-for="(item, index) in [...testimonials, ...testimonials]"
              :key="index"
            >
              <div class="stars-row">
                <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <p class="quote-text">{{ item.quote }}</p>
              <div class="client-row">
                <div class="client-avatar">{{ item.name ? item.name.charAt(0).toUpperCase() : 'U' }}</div>
                <div>
                  <div class="client-name">{{ item.name }}</div>
                  <div class="client-biz">{{ item.business }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t } = useI18n()

const testimonials = ref([])
const loading = ref(true)

const fetchComments = async () => {
  try {
    const response = await api.get('public/comments')
    if (response.data && response.data.success) {
      testimonials.value = response.data.data.map(item => {
        const d = new Date(item.createdAt)
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        return {
          quote: item.comment,
          name: item.commenter,
          business: `${dd}.${mm}.${yyyy}`
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch comments', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.testimonials-section {
  padding: 7rem 0;
  background: #F8FAFC;
  overflow: hidden;
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
  background: rgba(236, 72, 153, 0.08);
  border: 1px solid rgba(236, 72, 153, 0.15);
  color: #EC4899;
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

/* Marquee */
.marquee-outer {
  width: 100%;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

.marquee-track {
  display: flex;
  gap: 1.25rem;
  width: max-content;
  animation: marquee 35s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Card */
.testimonial-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 1.75rem;
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: box-shadow 0.3s ease;
}

.testimonial-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
}

.stars-row {
  display: flex;
  gap: 2px;
}

.quote-text {
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.65;
  flex: 1;
  font-style: italic;
}

.client-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #F1F5F9;
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007BFF, #6366F1);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0F172A;
}

.client-biz {
  font-size: 0.78rem;
  color: #94A3B8;
  margin-top: 1px;
}

@media (max-width: 768px) {
  .testimonials-section { padding: 5rem 0; }
  .testimonial-card { min-width: 270px; max-width: 270px; padding: 1.25rem; }
}
</style>
