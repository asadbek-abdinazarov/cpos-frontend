<script setup>
import { RouterView } from 'vue-router'
import AppNotification from '@/components/AppNotification.vue'
import { isLoading } from '@/composables/useAppLoader'
</script>

<template>
  <AppNotification />

  <!-- ─── Global dashboard transition loader ──── -->
  <Transition name="fade-loader">
    <div v-if="isLoading" class="dash-loader">
      <div class="dl-grid"></div>
      <div class="dl-orb dl-orb-1"></div>
      <div class="dl-orb dl-orb-2"></div>

      <div class="dl-body">
        <img src="/logo-nav.svg" alt="CPOS" class="dl-logo" />
        <div class="dl-ring">
          <svg viewBox="0 0 48 48" fill="none" class="dl-circle-svg">
            <circle cx="24" cy="24" r="20" stroke="rgba(0,123,255,0.15)" stroke-width="3" />
            <circle
              cx="24" cy="24" r="20"
              stroke="url(#dl-grad)"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="36 90"
            />
            <defs>
              <linearGradient id="dl-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stop-color="#007bff" />
                <stop offset="1" stop-color="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p class="dl-text">Kabinet yuklanmoqda…</p>
        <div class="dl-progress">
          <div class="dl-bar"></div>
        </div>
      </div>
    </div>
  </Transition>

  <RouterView />
</template>

<style>
/* ─── Dashboard loader ──────────────────────────── */
.dash-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dl-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.dl-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.dl-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.1) 0%, transparent 70%);
  top: -150px; right: -100px;
}

.dl-orb-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  bottom: -100px; left: -80px;
}

.dl-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.dl-logo {
  height: 40px;
  width: auto;
  opacity: 0.9;
}

.dl-ring {
  width: 56px;
  height: 56px;
}

.dl-circle-svg {
  width: 56px;
  height: 56px;
  animation: dl-spin 1.1s linear infinite;
}

@keyframes dl-spin {
  to { transform: rotate(360deg); }
}

.dl-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

.dl-progress {
  width: 180px;
  height: 3px;
  background: #e2e8f0;
  border-radius: 100px;
  overflow: hidden;
}

.dl-bar {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #6366f1);
  border-radius: 100px;
  animation: dl-fill 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes dl-fill {
  from { width: 0%; }
  to   { width: 100%; }
}

.fade-loader-enter-active { transition: opacity 0.2s ease; }
.fade-loader-leave-active { transition: opacity 0.35s ease; }
.fade-loader-enter-from,
.fade-loader-leave-to { opacity: 0; }
</style>
