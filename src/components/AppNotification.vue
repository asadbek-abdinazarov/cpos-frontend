<script setup>
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'
import { useNotification } from '@/composables/useNotification'

const { notification, closeNotification } = useNotification()
</script>

<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
        v-if="notification && notification.visible"
        class="notif-wrapper"
      >
        <div :class="['notif', `notif--${notification.type}`]">
          <div class="notif-icon-wrap">
            <CheckCircle v-if="notification.type === 'success'" :size="18" />
            <XCircle    v-else-if="notification.type === 'error'"   :size="18" />
            <Info       v-else                                        :size="18" />
          </div>
          <span class="notif-message">{{ notification.message }}</span>
          <button class="notif-close" @click="closeNotification">
            <X :size="14" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notif-wrapper {
  position: fixed;
  top: max(env(safe-area-inset-top, 0px), 20px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
}

.notif {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 12px 12px;
  border-radius: 14px;
  min-width: 280px;
  max-width: min(480px, calc(100vw - 32px));
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.06),
    0 12px 32px rgba(15, 23, 42, 0.10);
  font-family: var(--font-family-base, 'Poppins', sans-serif);
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.45;
}

/* ─── Icon wrap ─────────────────────── */
.notif-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  flex-shrink: 0;
}

.notif--success .notif-icon-wrap {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.notif--error .notif-icon-wrap {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.notif--info .notif-icon-wrap {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

/* ─── Top accent line ───────────────── */
.notif::before {
  content: '';
  position: absolute;
  top: 0;
  left: 14px;
  right: 14px;
  height: 2px;
  border-radius: 0 0 2px 2px;
}

.notif {
  position: relative;
  overflow: hidden;
}

.notif--success::before { background: linear-gradient(90deg, #10b981, #34d399); }
.notif--error::before   { background: linear-gradient(90deg, #ef4444, #f87171); }
.notif--info::before    { background: linear-gradient(90deg, #007bff, #6366f1); }

/* ─── Message ───────────────────────── */
.notif-message {
  flex: 1;
}

/* ─── Close button ──────────────────── */
.notif-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  color: #94a3b8;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
  padding: 0;
}

.notif-close:hover {
  background: #f1f5f9;
  color: #475569;
}

/* ─── Animation ─────────────────────── */
.notification-enter-active {
  animation: notifIn 0.32s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.notification-leave-active {
  animation: notifOut 0.25s cubic-bezier(0.55, 0.09, 0.68, 0.53);
}

@keyframes notifIn {
  from {
    opacity: 0;
    transform: translate(-50%, -32px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

@keyframes notifOut {
  from {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -24px) scale(0.96);
  }
}
</style>
