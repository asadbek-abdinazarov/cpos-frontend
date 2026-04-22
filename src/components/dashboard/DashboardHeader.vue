<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell, HelpCircle, Menu, CheckCheck, Inbox } from 'lucide-vue-next'
import {
  getUnreadNotificationCount,
  getNotifications,
  markNotificationAsRead,
} from '@/services/api'

const languages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'oz', name: 'Ўзбек' },
  { code: 'ru', name: 'Русский' },
]

const unreadCount           = ref(0)
const notifications         = ref([])
const showNotifications     = ref(false)
const loadingNotifications  = ref(false)

async function fetchUnreadCount() {
  try {
    const res = await getUnreadNotificationCount()
    if (res.data?.success) unreadCount.value = res.data.data
  } catch (err) { console.error(err) }
}

async function loadNotifications() {
  loadingNotifications.value = true
  try {
    const res = await getNotifications({ page: 0, size: 20, sort: 'id,desc' })
    if (res.data?.success) notifications.value = res.data.data.content
  } catch (err) { console.error(err) }
  finally { loadingNotifications.value = false }
}

async function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) await loadNotifications()
}

async function markAsRead(notification) {
  if (notification.isRead) return
  try {
    const res = await markNotificationAsRead(notification.id)
    if (res.data?.success) {
      notification.isRead = true
      if (unreadCount.value > 0) unreadCount.value--
    }
  } catch (err) { console.error(err) }
}

function closeNotifications(e) {
  if (showNotifications.value && !e.target.closest('.notif-wrapper')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  fetchUnreadCount()
  document.addEventListener('click', closeNotifications)
})

onUnmounted(() => {
  document.removeEventListener('click', closeNotifications)
})
</script>

<template>
  <header class="dashboard-header">
    <!-- bg grid overlay -->
    <div class="hdr-grid"></div>

    <div class="hdr-left">
      <button class="hdr-menu-btn" @click="$emit('toggle-sidebar')" aria-label="Menu">
        <Menu :size="20" />
      </button>
    </div>

    <div class="hdr-right">

      <!-- Language -->
      <div class="lang-wrap">
        <select v-model="$i18n.locale" class="lang-select">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>

      <!-- Notifications -->
      <div class="notif-wrapper">
        <button class="hdr-icon-btn" :class="{ active: showNotifications }" @click.stop="toggleNotifications" aria-label="Bildirishnomalar">
          <Bell :size="18" />
          <span v-if="unreadCount > 0" class="notif-badge">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <!-- Dropdown -->
        <Transition name="dropdown">
          <div v-if="showNotifications" class="notif-dropdown">
            <div class="notif-head">
              <div class="notif-head-left">
                <Bell :size="15" color="#007bff" />
                <h4>Bildirishnomalar</h4>
              </div>
              <span v-if="unreadCount > 0" class="unread-chip">
                {{ unreadCount }} yangi
              </span>
            </div>

            <div class="notif-body">
              <!-- Loading -->
              <div v-if="loadingNotifications" class="notif-state">
                <div class="notif-spinner"></div>
                <span>Yuklanmoqda…</span>
              </div>

              <!-- Empty -->
              <div v-else-if="notifications.length === 0" class="notif-state">
                <Inbox :size="32" color="#cbd5e1" />
                <span>Bildirishnomalar yo'q</span>
              </div>

              <!-- List -->
              <ul v-else class="notif-list">
                <li
                  v-for="item in notifications"
                  :key="item.id"
                  class="notif-item"
                  :class="{ unread: !item.isRead }"
                  @click="markAsRead(item)"
                >
                  <div class="notif-icon-col">
                    <div class="notif-icon-wrap" :class="item.isRead ? 'read' : 'unread'">
                      <CheckCheck :size="13" />
                    </div>
                  </div>
                  <div class="notif-text">
                    <p class="notif-title">{{ item.subject }}</p>
                    <p class="notif-body-text">{{ item.body }}</p>
                    <p class="notif-time">{{ new Date(item.createdAt).toLocaleString('uz-UZ') }}</p>
                  </div>
                  <span v-if="!item.isRead" class="unread-dot"></span>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Help -->
      <button class="hdr-icon-btn" aria-label="Yordam">
        <HelpCircle :size="18" />
      </button>

    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  position: relative;
  height: 70px;
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.75rem;
  z-index: 40;
  overflow: visible;
}

/* Subtle bg grid */
.hdr-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.025) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}

.hdr-left,
.hdr-right {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Hamburger */
.hdr-menu-btn {
  display: none;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  padding: 0.5rem;
  color: #64748b;
  border-radius: 10px;
  min-width: 40px;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.hdr-menu-btn:hover {
  background: #f8fafc;
  border-color: #007bff;
  color: #007bff;
}

/* Language */
.lang-wrap {
  display: flex;
  align-items: center;
}

.lang-select {
  padding: 0.45rem 0.65rem;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: transparent;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.lang-select:focus,
.lang-select:hover {
  border-color: #007bff;
  color: #007bff;
}

/* Icon buttons */
.hdr-icon-btn {
  position: relative;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.hdr-icon-btn:hover {
  background: #f8fafc;
  border-color: #007bff;
  color: #007bff;
}

.hdr-icon-btn.active {
  background: rgba(0,123,255,0.07);
  border-color: rgba(0,123,255,0.3);
  color: #007bff;
}

/* Notification badge */
.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 100px;
  border: 2px solid #fff;
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
}

/* ─── Notification dropdown ──────────────────────── */
.notif-wrapper {
  position: relative;
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 4px 6px -1px rgba(0,0,0,0.07),
    0 20px 40px -8px rgba(0,0,0,0.12);
  z-index: 100;
  overflow: hidden;
}

.notif-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.1rem;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.notif-head-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.notif-head h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.unread-chip {
  font-size: 0.7rem;
  font-weight: 600;
  color: #007bff;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.18);
  padding: 2px 9px;
  border-radius: 100px;
}

.notif-body {
  max-height: 360px;
  overflow-y: auto;
}

.notif-body::-webkit-scrollbar { width: 4px; }
.notif-body::-webkit-scrollbar-track { background: transparent; }
.notif-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

/* Empty / loading state */
.notif-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2.5rem 1rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

.notif-spinner {
  width: 22px;
  height: 22px;
  border: 2.5px solid #e2e8f0;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Notification list */
.notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: #f8fafc; }
.notif-item.unread { background: rgba(0,123,255,0.03); }
.notif-item.unread:hover { background: rgba(0,123,255,0.06); }

.notif-icon-col { flex-shrink: 0; margin-top: 2px; }

.notif-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-icon-wrap.unread { background: rgba(0,123,255,0.1); color: #007bff; }
.notif-icon-wrap.read   { background: #f1f5f9; color: #94a3b8; }

.notif-text { flex: 1; min-width: 0; }

.notif-title {
  margin: 0 0 3px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-body-text {
  margin: 0 0 4px;
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-time {
  margin: 0;
  font-size: 0.68rem;
  color: #94a3b8;
}

.unread-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #007bff;
  flex-shrink: 0;
  margin-top: 5px;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 1024px) {
  .hdr-menu-btn {
    display: flex;
  }
}

@media (max-width: 640px) {
  .dashboard-header {
    padding: 0 1rem;
  }

  .notif-dropdown {
    width: min(320px, calc(100vw - 1.5rem));
    right: -0.5rem;
  }
}
</style>
