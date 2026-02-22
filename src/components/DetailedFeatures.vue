<script setup>
import { useI18n } from 'vue-i18n'
import analyticsImg from '@/assets/images/real-time-business-analize.png'
import inventoryImg from '@/assets/images/smart-warehouse.png'
import paymentsImg from '@/assets/images/payment-integration.png'
import { Check } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<template>
  <section class="detailed-features" id="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ t('detailed_features.title') }}</h2>
        <p class="section-subtitle">
          {{ t('detailed_features.subtitle') }}
        </p>
      </div>

      <div class="features-wrapper">
        <!-- Feature 1: Analytics (Image Left, Text Right) -->
        <div class="feature-row">
          <div class="feature-image">
             <img :src="analyticsImg" alt="Real-time Analytics" class="feature-img">
          </div>
          <div class="feature-content">
            <div class="icon-wrapper analytics-icon">
              <!-- Graph Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3 class="feature-title">{{ t('detailed_features.analytics.title') }}</h3>
            <p class="feature-desc">
              {{ t('detailed_features.analytics.desc') }}
            </p>
            <ul class="feature-list">
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.analytics.list[0]') }}
              </li>
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.analytics.list[1]') }}
              </li>
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.analytics.list[2]') }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Feature 2: Smart Inventory (Text Left, Image Right) -->
        <div class="feature-row reverse">
          <div class="feature-content">
            <div class="icon-wrapper inventory-icon">
              <!-- Box Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3 class="feature-title">{{ t('detailed_features.inventory.title') }}</h3>
            <p class="feature-desc">
              {{ t('detailed_features.inventory.desc') }}
            </p>
            <ul class="feature-list">
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.inventory.list[0]') }}
              </li>
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.inventory.list[1]') }}
              </li>
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.inventory.list[2]') }}
              </li>
            </ul>
          </div>
          <div class="feature-image">
             <!-- Placeholder for Inventory/Graph Abstract -->
             <img :src="inventoryImg" alt="Smart Inventory" class="feature-img">
          </div>
        </div>

        <!-- Feature 3: Local Payments (Image Left, Text Right) -->
        <div class="feature-row">
          <div class="feature-image">
            <!-- Placeholder for Payments -->
            <img :src="paymentsImg" alt="Payment Integration" class="feature-img">
          </div>
          <div class="feature-content">
            <div class="icon-wrapper payments-icon">
              <!-- Card/Wallet Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <h3 class="feature-title">{{ t('detailed_features.payments.title') }}</h3>
            <p class="feature-desc">
              {{ t('detailed_features.payments.desc') }}
            </p>
            <ul class="feature-list">
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.payments.list[0]') }}
              </li>
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.payments.list[1]') }}
              </li>
              <li>
                <Check class="check-icon" /> {{ t('detailed_features.payments.list[2]') }}
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.detailed-features {
  padding: 6rem 0;
  background-color: var(--color-background); /* White or very light */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 5rem;
}

.section-title {
  font-size: 2.5rem;
  color: #0F172A;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #64748B; /* Slate 500 */
  font-size: 1.125rem;
  line-height: 1.6;
}

.features-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Reverse modifier for alternating layout */
.feature-row.reverse .feature-content {
  order: 1; /* Default is 0, so this stays left in grid logic unless we swap col placement or use order */
}
/* Actually grid auto placement handles order visually if distinct cells or we can just swap HTML order. 
   But simpler implementation for grid: define specific areas or just rely on DOM order for normal flow.
   Wait, if I use `order`, it works in Flexbox. In Grid, it works too if I don't strictly define areas.
   Let's use a simpler approach: 
   The HTML structure is:
   Row 1: Image, Content
   Row 2: Content, Image (I manually swapped in HTML)
   Row 3: Image, Content
   So CSS doesn't need complex ordering, just responsive handling.
*/

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px; /* Slightly rounded */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.analytics-icon { background-color: #DBEAFE; color: #2563EB; }
.inventory-icon { background-color: #DCFCE7; color: #16A34A; }
.payments-icon { background-color: #D1FAE5; color: #059669; }

.feature-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.feature-desc {
  color: #64748B;
  font-size: 1.05rem;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #475569;
  font-weight: 500;
}

.check-icon {
  color: #10B981; /* Emerald 500 */
  font-weight: bold;
}

/* Images & Placeholders */
.feature-image {
  position: relative;
  width: 100%;
}

.dashboard-placeholder {
  background: linear-gradient(135deg, #A5F3FC 0%, #0891B2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.inventory-placeholder {
  background: linear-gradient(to right, #111827, #1F2937); /* Dark theme look */
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-placeholder {
  background-color: #2D9C8E; /* Teal-ish */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Placeholder internal graphics (abstract) */
.placeholder-content {
  background: white;
  width: 90%;
  height: 80%;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ph-header { display: flex; gap: 4px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #E2E8F0; }
.ph-body { display: flex; gap: 1rem; flex: 1; }
.ph-sidebar { width: 20%; background: #F1F5F9; border-radius: 4px; }
.ph-main { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.ph-chart { height: 60%; background: #E0F2FE; border-radius: 4px; }
.ph-bars { display: flex; gap: 4px; height: 30%; }
.ph-bars span { flex: 1; background: #DBEAFE; border-radius: 2px; }

.abstract-circle {
  width: 60px;
  height: 80px;
  border: 4px solid #0EA5E9;
  border-radius: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0EA5E9;
  font-size: 2rem;
  font-weight: bold;
}




/* Responsive */
@media (max-width: 960px) {
  .feature-row {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: left;
  }

  /* Ensure consistent Image Top, Content Bottom */
  .feature-row {
    display: flex;
    flex-direction: column;
  }
  
  .feature-row.reverse {
    flex-direction: column; /* Changed from column-reverse to column to keep image on top if image is first in HTML? 
                             Wait, in HTML: 
                             Row 1: Image, Content. Column -> Image Top.
                             Row 2: Content, Image. Column -> Content Top. 
                             To make Row 2 Image Top: flex-direction: column-reverse.
                             */
    flex-direction: column-reverse;
  }
  
  .detailed-features {
    padding: 4rem 0;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .detailed-features {
    padding: 4rem 0;
  }
  
  .feature-row {
    gap: 2rem; /* Reduced gap */
  }
}
</style>
