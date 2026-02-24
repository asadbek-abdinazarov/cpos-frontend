<script setup>
import { useNotification } from '@/composables/useNotification'

const { notification, closeNotification } = useNotification()
</script>

<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
        v-if="notification && notification.visible"
        class="notification-wrapper"
      >
        <div :class="['notification', `notification--${notification.type}`]">
          <span class="notification-icon">
            <template v-if="notification.type === 'success'">✓</template>
            <template v-else-if="notification.type === 'error'">✕</template>
            <template v-else>ℹ</template>
          </span>
          <span class="notification-message">{{ notification.message }}</span>
          <button class="notification-close" @click="closeNotification">×</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notification-wrapper {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  pointer-events: none;
}

.notification {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  min-width: 320px;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
}

.notification--success {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #a7f3d0;
  color: #065f46;
}

.notification--error {
  background: linear-gradient(135deg, #fef2f2, #fde8e8);
  border: 1px solid #fecaca;
  color: #991b1b;
}

.notification--info {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}

.notification--success .notification-icon {
  background-color: #10b981;
  color: white;
}

.notification--error .notification-icon {
  background-color: #ef4444;
  color: white;
}

.notification--info .notification-icon {
  background-color: #3b82f6;
  color: white;
}

.notification-message {
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 0 4px;
  line-height: 1;
  color: inherit;
}

.notification-close:hover {
  opacity: 1;
}

/* Slide down from top animation */
.notification-enter-active {
  animation: slideDown 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.notification-leave-active {
  animation: slideUp 0.3s cubic-bezier(0.55, 0.09, 0.68, 0.53);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -40px) scale(0.95);
  }
}
</style>
