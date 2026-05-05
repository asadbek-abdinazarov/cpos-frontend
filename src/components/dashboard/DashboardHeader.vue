<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Bell, HelpCircle, Menu, CheckCheck, Inbox,
  Package, ShoppingCart, BarChart2, Users,
  LayoutGrid, Settings, Keyboard, Mail, ExternalLink,
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  getUnreadNotificationCount,
  getNotifications,
  markNotificationAsRead,
} from '@/services/api'
import BaseModal from '@/components/BaseModal.vue'

const route = useRoute()
const { t } = useI18n()

const pageMeta = computed(() => {
  const path = route.path
  if (path === '/dashboard' || path === '/dashboard/')
    return { title: t('dashboard.sidebar.analytics'), icon: 'TrendingUp' }
  if (path.startsWith('/dashboard/analytics'))
    return { title: t('dashboard.sidebar.analytics'), icon: 'TrendingUp' }
  if (path.startsWith('/dashboard/products'))
    return { title: t('dashboard.sidebar.products'), icon: 'Package' }
  if (path.startsWith('/dashboard/categories'))
    return { title: t('dashboard.sidebar.categories'), icon: 'LayoutGrid' }
  if (path.startsWith('/dashboard/sales'))
    return { title: t('dashboard.sidebar.sales'), icon: 'ShoppingBag' }
  if (path.startsWith('/dashboard/cashiers'))
    return { title: t('dashboard.sidebar.cashiers'), icon: 'Users' }
  if (path.startsWith('/dashboard/settings'))
    return { title: 'Sozlamalar', icon: 'Settings' }
  return { title: 'Dashboard', icon: 'LayoutDashboard' }
})

const languages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'oz', name: 'Ўзбек' },
  { code: 'ru', name: 'Русский' },
]

const showHelp              = ref(false)

const helpFeatures = [
  { icon: Package,     color: 'blue',   titleKey: 'dashboard.sidebar.products',   descKey: 'help.products_desc' },
  { icon: ShoppingCart,color: 'green',  titleKey: 'dashboard.sidebar.sales',      descKey: 'help.sales_desc' },
  { icon: BarChart2,   color: 'indigo', titleKey: 'dashboard.sidebar.analytics',  descKey: 'help.analytics_desc' },
  { icon: LayoutGrid,  color: 'amber',  titleKey: 'dashboard.sidebar.categories', descKey: 'help.categories_desc' },
  { icon: Users,       color: 'teal',   titleKey: 'dashboard.sidebar.cashiers',   descKey: 'help.cashiers_desc' },
  { icon: Settings,    color: 'slate',  titleKey: 'dashboard.sidebar.settings',   descKey: 'help.settings_desc' },
]

const shortcuts = [
  { keys: ['Alt', '1'], action: 'help.shortcut_analytics' },
  { keys: ['Alt', '2'], action: 'help.shortcut_products' },
  { keys: ['Alt', '3'], action: 'help.shortcut_sales' },
  { keys: ['Esc'],      action: 'help.shortcut_close' },
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

const markAllAsRead = async () => {
  const unread = notifications.value.filter(n => !n.isRead)
  if (unread.length === 0) return
  try {
    await Promise.all(unread.map(n => markNotificationAsRead(n.id)))
    notifications.value.forEach(n => { n.isRead = true })
    unreadCount.value = 0
  } catch (err) { console.error(err) }
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
      <div class="hdr-page-info">
        <h1 class="hdr-page-title">{{ pageMeta.title }}</h1>
      </div>
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
        <button class="hdr-icon-btn" :class="{ active: showNotifications }" @click.stop="toggleNotifications" :aria-label="$t('dashboard.header.notifications')">
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
                <h4>{{ $t('dashboard.header.notifications') }}</h4>
              </div>
              <div class="notif-head-right">
                <span v-if="unreadCount > 0" class="unread-chip">
                  {{ unreadCount }} {{ $t('dashboard.header.new') }}
                </span>
                <button
                  v-if="unreadCount > 0"
                  class="mark-all-btn"
                  @click.stop="markAllAsRead"
                  :title="$t('dashboard.header.mark_all_read')"
                >
                  <CheckCheck :size="13" />
                  <span class="mark-all-text">{{ $t('dashboard.header.mark_all_read') }}</span>
                </button>
              </div>
            </div>

            <div class="notif-body">
              <!-- Loading -->
              <div v-if="loadingNotifications" class="notif-state">
                <div class="notif-spinner"></div>
                <span>{{ $t('dashboard.header.loading') }}</span>
              </div>

              <!-- Empty -->
              <div v-else-if="notifications.length === 0" class="notif-state">
                <Inbox :size="32" color="#cbd5e1" />
                <span>{{ $t('dashboard.header.no_notifications') }}</span>
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
      <button
        class="hdr-icon-btn"
        :class="{ active: showHelp }"
        aria-label="Yordam"
        @click="showHelp = true"
      >
        <HelpCircle :size="18" />
      </button>

    </div>
  </header>

  <!-- ─── Help Modal ─────────────────────────── -->
  <BaseModal v-model="showHelp" size="lg">
    <template #icon><HelpCircle :size="20" /></template>

    <template #default>
      <div class="help-modal">

        <!-- Hero band -->
        <div class="hm-hero">
          <div class="hm-hero-bg"></div>
          <div class="hm-hero-inner">
            <div class="hm-hero-icon">
              <HelpCircle :size="26" />
            </div>
            <div>
              <h2 class="hm-hero-title">{{ $t('help.title') }}</h2>
              <p class="hm-hero-sub">{{ $t('help.subtitle') }}</p>
            </div>
          </div>
        </div>

        <!-- Section: Features -->
        <div class="hm-section">
          <div class="hm-section-label">
            <LayoutGrid :size="13" />
            {{ $t('help.features_label') }}
          </div>
          <div class="hm-features-grid">
            <div
              v-for="feat in helpFeatures"
              :key="feat.titleKey"
              class="hm-feat-card"
              :class="`hm-feat-${feat.color}`"
            >
              <div class="hm-feat-icon">
                <component :is="feat.icon" :size="17" />
              </div>
              <div class="hm-feat-body">
                <span class="hm-feat-title">{{ $t(feat.titleKey) }}</span>
                <span class="hm-feat-desc">{{ $t(feat.descKey) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Shortcuts -->
        <div class="hm-section">
          <div class="hm-section-label">
            <Keyboard :size="13" />
            {{ $t('help.shortcuts_label') }}
          </div>
          <div class="hm-shortcuts">
            <div v-for="s in shortcuts" :key="s.action" class="hm-shortcut-row">
              <div class="hm-keys">
                <kbd v-for="k in s.keys" :key="k" class="hm-kbd">{{ k }}</kbd>
              </div>
              <span class="hm-shortcut-action">{{ $t(s.action) }}</span>
            </div>
          </div>
        </div>

        <!-- Section: Contact -->
        <div class="hm-section hm-contact">
          <div class="hm-contact-inner">
            <Mail :size="16" class="hm-contact-icon" />
            <div>
              <p class="hm-contact-title">{{ $t('help.contact_title') }}</p>
              <p class="hm-contact-sub">{{ $t('help.contact_sub') }}</p>
            </div>
            <a href="mailto:support@cpos.uz" class="hm-contact-btn">
              {{ $t('help.contact_btn') }}
              <ExternalLink :size="13" />
            </a>
          </div>
        </div>

      </div>
    </template>
  </BaseModal>
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
  gap: 0.75rem;
}

.notif-head-left {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.notif-head h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-head-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
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

.mark-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid rgba(0,123,255,0.2);
  background: rgba(0,123,255,0.06);
  color: #007bff;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;
  line-height: 1;
}
.mark-all-btn:hover {
  background: rgba(0,123,255,0.12);
}

.mark-all-text {
  white-space: nowrap;
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
  line-clamp: 2;
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

/* ─── Page info ─────────────────────────────────── */
.hdr-page-info {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
}

.hdr-page-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

@media (max-width: 480px) {
  .hdr-page-title {
    font-size: 0.9rem;
  }
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

@media (max-width: 420px) {
  .mark-all-btn {
    padding: 6px;
    gap: 0;
  }

  .mark-all-text {
    display: none;
  }
}

/* ─── Help Modal Content ─────────────────────────── */
.help-modal {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 0.25rem;
}

.hm-hero {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(135deg, #0a1628 0%, #0f1f3d 100%);
  border: 1px solid rgba(0, 123, 255, 0.15);
}

.hm-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 85% 50%, rgba(0, 123, 255, 0.2) 0%, transparent 60%),
    radial-gradient(circle at 10% 80%, rgba(99, 102, 241, 0.12) 0%, transparent 50%);
  pointer-events: none;
}

.hm-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.hm-hero-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: rgba(0, 123, 255, 0.2);
  border: 1px solid rgba(0, 123, 255, 0.3);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.2);
}

.hm-hero-title {
  margin: 0 0 3px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}

.hm-hero-sub {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
}

/* Section wrapper */
.hm-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.hm-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Features grid */
.hm-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.hm-feat-card {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 11px;
  border: 1px solid #eef2f7;
  background: #f9fafb;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
  cursor: default;
}

.hm-feat-card:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  transform: translateY(-1px);
}

.hm-feat-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Feat color variants */
.hm-feat-blue   .hm-feat-icon { background: rgba(0, 123, 255, 0.1);  color: #007bff; }
.hm-feat-green  .hm-feat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.hm-feat-indigo .hm-feat-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.hm-feat-amber  .hm-feat-icon { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.hm-feat-teal   .hm-feat-icon { background: rgba(20, 184, 166, 0.1); color: #0d9488; }
.hm-feat-slate  .hm-feat-icon { background: rgba(100, 116, 139, 0.1);color: #64748b; }

.hm-feat-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.hm-feat-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hm-feat-desc {
  font-size: 0.7rem;
  color: #94a3b8;
  line-height: 1.35;
}

/* Shortcuts */
.hm-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  border-radius: 11px;
  overflow: hidden;
}

.hm-shortcut-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.12s;
}

.hm-shortcut-row:last-child { border-bottom: none; }
.hm-shortcut-row:hover { background: #f1f5f9; }

.hm-keys {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  min-width: 110px;
}

.hm-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-bottom-width: 2.5px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #334155;
  font-family: 'SF Mono', 'Fira Code', monospace;
  box-shadow: 0 1px 0 rgba(0,0,0,0.08);
}

.hm-shortcut-action {
  font-size: 0.82rem;
  color: #475569;
  font-weight: 500;
}

/* Contact */
.hm-contact {
  background: rgba(0, 123, 255, 0.04);
  border: 1px solid rgba(0, 123, 255, 0.12);
  border-radius: 12px;
  padding: 0 !important;
  gap: 0 !important;
  overflow: hidden;
}

.hm-contact-inner {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.15rem;
}

.hm-contact-icon { color: #007bff; flex-shrink: 0; }

.hm-contact-title {
  margin: 0 0 2px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}

.hm-contact-sub {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

.hm-contact-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.45rem 1rem;
  background: #007bff;
  color: #fff;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
  flex-shrink: 0;
}

.hm-contact-btn:hover {
  background: #0069d9;
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .hm-features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hm-contact-inner {
    flex-wrap: wrap;
  }

  .hm-contact-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>
