<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell, HelpCircle, Menu } from 'lucide-vue-next'
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

const unreadCount = ref(0)
const notifications = ref([])
const showNotifications = ref(false)
const loadingNotifications = ref(false)

async function fetchUnreadCount() {
  try {
    const res = await getUnreadNotificationCount()
    if (res.data?.success) {
      unreadCount.value = res.data.data
    }
  } catch (err) {
    console.error(err)
  }
}

async function loadNotifications() {
  loadingNotifications.value = true
  try {
    const res = await getNotifications({ page: 0, size: 20, sort: 'id,desc' })
    if (res.data?.success) {
      notifications.value = res.data.data.content
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingNotifications.value = false
  }
}

async function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    await loadNotifications()
  }
}

async function markAsRead(notification) {
  if (notification.isRead) return
  try {
    const res = await markNotificationAsRead(notification.id)
    if (res.data?.success) {
      notification.isRead = true
      if (unreadCount.value > 0) unreadCount.value--
    }
  } catch (err) {
    console.error(err)
  }
}

function closeNotifications(e) {
  if (showNotifications.value && !e.target.closest('.notification-wrapper')) {
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
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <Menu class="icon-md" />
      </button>
    </div>

    <div class="header-actions">
      <div class="lang-switcher">
        <select v-model="$i18n.locale" class="lang-select">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>

      <div class="notification-wrapper">
        <button class="icon-btn notification-btn" @click.stop="toggleNotifications">
          <Bell class="icon-md" />
          <span class="badge" v-if="unreadCount > 0">{{
            unreadCount > 99 ? '99+' : unreadCount
          }}</span>
        </button>

        <div v-if="showNotifications" class="notification-dropdown shadow-lg">
          <div class="dropdown-header">
            <h4>Notifications</h4>
            <span class="unread-text" v-if="unreadCount > 0">{{ unreadCount }} unread</span>
          </div>

          <div class="dropdown-body">
            <div v-if="loadingNotifications" class="p-4 text-center text-sm text-gray-500">
              Loading...
            </div>
            <div
              v-else-if="notifications.length === 0"
              class="p-4 text-center text-sm text-gray-500"
            >
              No notifications.
            </div>
            <ul v-else class="notification-list">
              <li
                v-for="item in notifications"
                :key="item.id"
                class="notification-item"
                :class="{ unread: !item.isRead }"
                @click="markAsRead(item)"
              >
                <div class="notif-content">
                  <p class="notif-title">{{ item.subject }}</p>
                  <p class="notif-body">{{ item.body }}</p>
                  <p class="notif-time">{{ new Date(item.createdAt).toLocaleString('uz-UZ') }}</p>
                </div>
                <div v-if="!item.isRead" class="unread-dot"></div>
              </li>
            </ul>
          </div>
          <!-- <div class="dropdown-footer">
            <button class="view-all-btn">View All</button>
          </div> -->
        </div>
      </div>

      <button class="icon-btn">
        <HelpCircle class="icon-md" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #64748b;
  border-radius: 8px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 300px;
  gap: 0.75rem;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #0f172a;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  transition: background 0.2s;
  position: relative;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.icon-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.icon-md {
  width: 22px;
  height: 22px;
}

.lang-select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  outline: none;
}

.lang-select:focus {
  border-color: var(--color-primary);
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  border: 2px solid white;
  min-width: 16px;
  text-align: center;
}

@media (max-width: 1024px) {
  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .search-bar {
    display: none; /* Hide search on mobile for cleaner look, or reduce width */
  }

  .dashboard-header {
    padding: 0 1rem;
  }

  .notification-dropdown {
    width: min(340px, calc(100vw - 2rem));
    max-width: calc(100vw - 2rem);
  }
}

.notification-wrapper {
  position: relative;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 340px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.unread-text {
  font-size: 0.75rem;
  color: #2563eb;
  font-weight: 600;
  background: #eff6ff;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.dropdown-body {
  max-height: 360px;
  overflow-y: auto;
}

.notification-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #f0f9ff;
}
.notification-item.unread:hover {
  background: #e0f2fe;
}

.notif-content {
  flex: 1;
}

.notif-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.notif-body {
  margin: 0 0 0.4rem 0;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.4;
}

.notif-time {
  margin: 0;
  font-size: 0.7rem;
  color: #94a3b8;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  margin-top: 0.25rem;
}

.p-4 {
  padding: 1rem;
}
.text-center {
  text-align: center;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
</style>
