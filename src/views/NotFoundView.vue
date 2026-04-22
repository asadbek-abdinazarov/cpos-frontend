<script setup>
import { useRouter } from 'vue-router'
import { Home, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="nf-page">
    <div class="nf-orb nf-orb-1"></div>
    <div class="nf-orb nf-orb-2"></div>
    <div class="nf-grid"></div>

    <div class="nf-card">
      <div class="nf-code">404</div>
      <h1 class="nf-title">Sahifa topilmadi</h1>
      <p class="nf-subtitle">
        Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
      </p>
      <div class="nf-actions">
        <button class="nf-btn-ghost" @click="router.back()">
          <ArrowLeft :size="16" />
          Orqaga
        </button>
        <button class="nf-btn-primary" @click="router.push('/')">
          <Home :size="16" />
          Bosh sahifaga
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

.nf-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.nf-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.nf-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.1) 0%, transparent 70%);
  top: -150px;
  right: -100px;
}
.nf-orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  bottom: -120px;
  left: -80px;
}

.nf-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.06),
    0 16px 48px rgba(15, 23, 42, 0.08);
}

.nf-code {
  font-size: 6rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, #007bff 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.04em;
}

.nf-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem;
}

.nf-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.nf-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nf-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.25);
  font-family: inherit;
}
.nf-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.35);
}

.nf-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.65rem 1.25rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.nf-btn-ghost:hover {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
