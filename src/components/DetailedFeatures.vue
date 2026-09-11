<script setup>
import { useI18n } from 'vue-i18n'
import { BarChart3, Package, Users, Check } from 'lucide-vue-next'

const { t, tm } = useI18n()

/**
 * Har bir qator kabinetning haqiqiy bo'limiga mos keladi.
 * Rasm o'rniga interfeys kod bilan chiziladi — tarjima bo'ladi va og'irlik qo'shmaydi.
 */
const rows = [
  { key: 'analytics', icon: BarChart3, accent: '#007BFF', mock: 'analytics', reverse: false },
  { key: 'inventory', icon: Package, accent: '#10B981', mock: 'products', reverse: true },
  { key: 'payments', icon: Users, accent: '#6366F1', mock: 'sales', reverse: false },
]

const trend = [38, 55, 44, 70, 88, 62]

const products = [
  { name: 'Kofe latte', code: '4780 1234', qty: '124', tone: 'ok' },
  { name: 'Dona non', code: '4780 5567', qty: '38', tone: 'ok' },
  { name: 'Sharbat 1L', code: '4780 8890', qty: '6', tone: 'low' },
]

const sales = [
  { id: '#1042', pay: 'cash', sum: '84 000' },
  { id: '#1041', pay: 'card', sum: '212 500' },
  { id: '#1040', pay: 'transfer', sum: '46 000' },
]

const m = (key) => t(`detailed_features.mock.${key}`)
</script>

<template>
  <section class="detailed-features" id="features">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <h2 class="section-title">{{ t('detailed_features.title') }}</h2>
        <p class="section-sub">{{ t('detailed_features.subtitle') }}</p>
      </div>

      <div class="rows-wrapper">
        <article
          v-for="(row, i) in rows"
          :key="row.key"
          :class="['feature-row', { reverse: row.reverse }]"
          data-aos="fade-up"
          :data-aos-delay="i * 60"
        >
          <!-- ── Interfeys ko'rinishi ─────────────── -->
          <div class="mock-side">
            <div class="mock-frame">
              <!-- Analitika -->
              <div v-if="row.mock === 'analytics'" class="mock mock-analytics">
                <div class="mock-bar-head">
                  <span class="mock-chip"></span>
                  <span class="mock-chip mock-chip--wide"></span>
                </div>
                <div class="mock-kpis">
                  <div v-for="n in 3" :key="n" class="mock-kpi">
                    <span class="mock-kpi-label"></span>
                    <span class="mock-kpi-val"></span>
                  </div>
                </div>
                <div class="mock-chart">
                  <div v-for="(h, bi) in trend" :key="bi" class="mock-bar" :style="{ height: `${h}%` }"></div>
                </div>
              </div>

              <!-- Mahsulotlar jadvali -->
              <div v-else-if="row.mock === 'products'" class="mock mock-table">
                <div class="mock-thead">
                  <span>{{ m('product') }}</span>
                  <span class="hide-xs">{{ m('barcode') }}</span>
                  <span class="ta-end">{{ m('stock') }}</span>
                </div>
                <div v-for="p in products" :key="p.code" class="mock-trow">
                  <span class="mock-cell-main">
                    <span class="mock-thumb"></span>
                    {{ p.name }}
                  </span>
                  <span class="mock-code hide-xs">{{ p.code }}</span>
                  <span class="ta-end">
                    <span class="mock-pill" :class="`is-${p.tone}`">{{ p.qty }}</span>
                  </span>
                </div>
              </div>

              <!-- Sotuvlar tarixi -->
              <div v-else class="mock mock-table">
                <div class="mock-thead">
                  <span>{{ m('receipt') }}</span>
                  <span class="hide-xs">{{ m('payment') }}</span>
                  <span class="ta-end">{{ m('amount') }}</span>
                </div>
                <div v-for="s in sales" :key="s.id" class="mock-trow">
                  <span class="mock-cell-main">
                    <span class="mock-avatar"></span>
                    {{ s.id }}
                  </span>
                  <span class="hide-xs">
                    <span class="mock-tag" :class="`pay-${s.pay}`">{{ m(s.pay) }}</span>
                  </span>
                  <span class="mock-sum ta-end">{{ s.sum }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Matn ─────────────────────────────── -->
          <div class="content-side">
            <div class="feature-icon" :style="{ background: `${row.accent}18`, color: row.accent }">
              <component :is="row.icon" :size="22" :stroke-width="2" />
            </div>
            <h3 class="feature-title">{{ t(`detailed_features.${row.key}.title`) }}</h3>
            <p class="feature-desc">{{ t(`detailed_features.${row.key}.desc`) }}</p>
            <ul class="feature-list">
              <li v-for="(item, li) in tm(`detailed_features.${row.key}.list`)" :key="li">
                <span class="check-icon" :style="{ background: `${row.accent}18`, color: row.accent }">
                  <Check :size="12" :stroke-width="3" />
                </span>
                {{ item }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detailed-features {
  padding: clamp(4rem, 9vw, 7rem) 0;
  background: #fff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--page-gutter, 2rem);
}

.section-head {
  text-align: center;
  max-width: 700px;
  margin: 0 auto clamp(2.5rem, 6vw, 4rem);
}

.section-title {
  font-size: clamp(1.75rem, 4.5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.section-sub {
  font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  color: #64748b;
  line-height: 1.7;
  text-wrap: pretty;
}

/* ─── Qatorlar ───────────────────────────────── */
.rows-wrapper {
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 4.5rem);
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
}

.feature-row.reverse .mock-side {
  order: 2;
}

/* ─── Mockup ramkasi ─────────────────────────── */
.mock-side {
  min-width: 0;
}

.mock-frame {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: clamp(1rem, 3vw, 1.75rem);
  transition: box-shadow 0.3s ease;
}

@media (hover: hover) {
  .mock-frame:hover {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.07);
  }
}

.mock {
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: clamp(0.75rem, 2vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: clamp(190px, 26vw, 250px);
}

/* Analitika mockup */
.mock-bar-head {
  display: flex;
  gap: 6px;
}

.mock-chip {
  height: 8px;
  width: 46px;
  border-radius: 4px;
  background: #eef2f7;
}

.mock-chip--wide {
  width: 74px;
  background: rgba(0, 123, 255, 0.16);
}

.mock-kpis {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.mock-kpi {
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mock-kpi-label {
  height: 5px;
  width: 70%;
  border-radius: 3px;
  background: #eef2f7;
}

.mock-kpi-val {
  height: 9px;
  width: 55%;
  border-radius: 3px;
  background: #dbeafe;
}

.mock-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex: 1;
  min-height: 70px;
}

.mock-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, rgba(0, 123, 255, 0.65), rgba(0, 123, 255, 0.22));
}

/* Jadval mockup */
.mock-table {
  gap: 0;
}

.mock-thead,
.mock-trow {
  display: grid;
  grid-template-columns: 1fr 0.8fr 0.5fr;
  align-items: center;
  gap: 8px;
  padding: 9px 4px;
}

.mock-thead {
  font-size: 0.6rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #f1f5f9;
}

.mock-trow {
  border-bottom: 1px solid #f8fafc;
  font-size: 0.72rem;
  color: #334155;
}

.mock-trow:last-child {
  border-bottom: none;
}

.mock-cell-main {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mock-thumb,
.mock-avatar {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: linear-gradient(135deg, #e0effe, #c7d7fd);
  flex-shrink: 0;
}

.mock-avatar {
  border-radius: 50%;
}

.mock-code {
  font-size: 0.66rem;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.ta-end {
  text-align: end;
}

.mock-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.64rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.mock-pill.is-ok {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.mock-pill.is-low {
  background: rgba(245, 158, 11, 0.14);
  color: #d97706;
}

.mock-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.62rem;
  font-weight: 600;
}

.pay-cash {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.pay-card {
  background: rgba(0, 123, 255, 0.12);
  color: #007bff;
}

.pay-transfer {
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
}

.mock-sum {
  font-weight: 700;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ─── Matn tomoni ────────────────────────────── */
.content-side {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  min-width: 0;
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-title {
  font-size: clamp(1.35rem, 3.2vw, 2rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-wrap: balance;
}

.feature-desc {
  font-size: clamp(0.92rem, 2vw, 1rem);
  color: #64748b;
  line-height: 1.7;
  text-wrap: pretty;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0;
  padding: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: clamp(0.88rem, 1.9vw, 0.95rem);
  color: #374151;
  font-weight: 500;
}

.check-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 960px) {
  .feature-row,
  .feature-row.reverse {
    grid-template-columns: 1fr;
  }

  /* Mobil oqim: har doim avval interfeys, keyin matn */
  .feature-row.reverse .mock-side {
    order: 0;
  }
}

@media (max-width: 480px) {
  .hide-xs {
    display: none;
  }

  .mock-thead,
  .mock-trow {
    grid-template-columns: 1fr auto;
  }

  .mock-frame {
    border-radius: 16px;
  }

  .feature-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
  }
}
</style>
