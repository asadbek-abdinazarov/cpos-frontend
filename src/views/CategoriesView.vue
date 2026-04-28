<script setup>
import { ref, onMounted } from 'vue'
import { useDelayedLoading } from '@/composables/useDelayedLoading'
import {
  LayoutGrid,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Package,
} from 'lucide-vue-next'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const categories = ref([])
const { loading, showSkeleton, startLoading, stopLoading } = useDelayedLoading()

const fetchCategories = async () => {
  startLoading()
  try {
    const res = await getCategories()
    if (res.data?.success && Array.isArray(res.data.data)) {
      categories.value = res.data.data
    }
  } catch {
    showNotification({ type: 'error', message: 'Kategoriyalarni yuklashda xatolik!' })
  } finally {
    stopLoading()
  }
}

// ─── Create / Edit modal ──────────────────────────
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingId = ref(null)
const form = ref({ name: '' })

const openCreate = () => {
  editingId.value = null
  form.value = { name: '' }
  isModalOpen.value = true
}

const openEdit = (cat) => {
  editingId.value = cat.id
  form.value = { name: cat.name }
  isModalOpen.value = true
}

const closeModal = () => { isModalOpen.value = false }

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (editingId.value) {
      const res = await updateCategory(editingId.value, form.value)
      if (res.data?.success) {
        showNotification({ type: 'success', message: 'Kategoriya yangilandi' })
        closeModal()
        await fetchCategories()
      }
    } else {
      const res = await createCategory(form.value)
      if (res.data?.success) {
        showNotification({ type: 'success', message: 'Kategoriya qoʻshildi' })
        closeModal()
        await fetchCategories()
      }
    }
  } catch {
    showNotification({ type: 'error', message: 'Xatolik yuz berdi' })
  } finally {
    isSubmitting.value = false
  }
}

// ─── Delete modal ─────────────────────────────────
const isDeleteModalOpen = ref(false)
const deletingId = ref(null)
const deletingName = ref('')
const isDeleting = ref(false)

const confirmDelete = (cat) => {
  deletingId.value = cat.id
  deletingName.value = cat.name
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => { isDeleteModalOpen.value = false }

const executeDelete = async () => {
  isDeleting.value = true
  try {
    const res = await deleteCategory(deletingId.value)
    if (res.data?.success) {
      showNotification({ type: 'success', message: 'Kategoriya oʻchirildi' })
      closeDeleteModal()
      await fetchCategories()
    }
  } catch {
    showNotification({ type: 'error', message: 'Oʻchirishda xatolik yuz berdi' })
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="cat-page">

    <!-- ─── Hero ───────────────────────────────────── -->
    <div class="cat-hero">
      <div class="cat-hero-grid"></div>
      <div class="cat-orb cat-orb-1"></div>
      <div class="cat-orb cat-orb-2"></div>
      <div class="cat-hero-body">
        <div class="cat-hero-left">
          <div class="cat-badge">
            <LayoutGrid :size="11" />
            Kategoriyalar
          </div>
          <h1 class="cat-title">Kategoriyalar</h1>
          <p class="cat-subtitle">Mahsulot kategoriyalarini boshqarish va tartibga solish</p>
        </div>
        <button class="cat-btn-primary" @click="openCreate">
          <Plus :size="15" />
          Yangi kategoriya
        </button>
      </div>
    </div>

    <!-- ─── Table card ──────────────────────────────── -->
    <div class="cat-card">
      <div class="cat-table-wrap">
        <table class="cat-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nomi</th>
              <th>Mahsulotlar</th>
              <th class="th-actions">Harakatlar</th>
            </tr>
          </thead>
          <tbody>

            <!-- Skeleton -->
            <template v-if="showSkeleton">
              <tr v-for="n in 6" :key="n" class="skel-row">
                <td><div class="skel" style="width:28px;height:12px"></div></td>
                <td>
                  <div class="cat-name-cell">
                    <div class="skel skel-icon"></div>
                    <div class="skel skel-name"></div>
                  </div>
                </td>
                <td><div class="skel" style="width:60px;height:12px"></div></td>
                <td>
                  <div style="display:flex;justify-content:flex-end;gap:.4rem">
                    <div class="skel skel-act"></div>
                    <div class="skel skel-act"></div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Rows -->
            <tr v-else v-for="cat in categories" :key="cat.id" class="cat-row">
              <td class="td-id">#{{ cat.id }}</td>
              <td>
                <div class="cat-name-cell">
                  <div class="cat-icon-wrap">
                    <LayoutGrid :size="14" />
                  </div>
                  <span class="cat-name">{{ cat.name }}</span>
                </div>
              </td>
              <td>
                <div class="cat-count-wrap">
                  <Package :size="13" class="cat-count-ico" />
                  <span class="cat-count">{{ cat.productCount ?? '—' }}</span>
                </div>
              </td>
              <td>
                <div class="cat-actions">
                  <button class="cat-act-btn cat-act-edit" title="Tahrirlash" @click="openEdit(cat)">
                    <Pencil :size="14" />
                  </button>
                  <button class="cat-act-btn cat-act-del" title="Oʻchirish" @click="confirmDelete(cat)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="!loading && categories.length === 0">
              <td colspan="4" class="cat-empty">
                <div class="cat-empty-inner">
                  <div class="cat-empty-icon"><LayoutGrid :size="28" /></div>
                  <p>Hozircha kategoriyalar yoʻq</p>
                  <button class="cat-btn-primary" @click="openCreate">
                    <Plus :size="14" /> Birinchisini qoʻshish
                  </button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Footer info -->
      <div class="cat-footer" v-if="!loading && categories.length > 0">
        <span class="cat-total">Jami {{ categories.length }} ta kategoriya</span>
      </div>
    </div>

    <!-- ─── Create / Edit Modal ──────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="cat-modal-overlay" @click.self="closeModal">
          <div class="cat-modal">
            <div class="cat-modal-header">
              <div class="cat-modal-icon">
                <LayoutGrid :size="20" />
              </div>
              <div>
                <h2 class="cat-modal-title">
                  {{ editingId ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya' }}
                </h2>
                <p class="cat-modal-sub">
                  {{ editingId ? 'Kategoriya nomini yangilang' : 'Yangi kategoriya nomini kiriting' }}
                </p>
              </div>
              <button class="cat-close-btn" @click="closeModal">
                <X :size="16" />
              </button>
            </div>
            <form @submit.prevent="handleSubmit" class="cat-modal-form">
              <div class="cat-form-group">
                <label>Kategoriya nomi</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Masalan: Ichimliklar"
                  autofocus
                />
              </div>
              <div class="cat-modal-footer">
                <button type="button" class="cat-btn-ghost" @click="closeModal" :disabled="isSubmitting">
                  Bekor qilish
                </button>
                <button type="submit" class="cat-btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="cat-spinner"></span>
                  {{ editingId ? 'Saqlash' : 'Yaratish' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Delete Modal ─────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isDeleteModalOpen" class="cat-modal-overlay" @click.self="closeDeleteModal">
          <div class="cat-modal cat-modal--sm">
            <div class="cat-del-icon">
              <AlertTriangle :size="24" />
            </div>
            <h2 class="cat-modal-title" style="text-align:center">Kategoriyani oʻchirish</h2>
            <p class="cat-del-text">
              <strong>{{ deletingName }}</strong> kategoriyasi oʻchiriladi.
              Bu amalni bekor qilib boʻlmaydi.
            </p>
            <div class="cat-modal-footer" style="justify-content:center">
              <button class="cat-btn-ghost" @click="closeDeleteModal" :disabled="isDeleting">
                Bekor qilish
              </button>
              <button class="cat-btn-danger" @click="executeDelete" :disabled="isDeleting">
                <span v-if="isDeleting" class="cat-spinner cat-spinner--red"></span>
                Oʻchirish
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.cat-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── Hero ─────────────────────────────────────── */
.cat-hero {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.75rem 2rem;
  overflow: hidden;
}

.cat-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.cat-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}
.cat-orb-1 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(0,123,255,0.09) 0%, transparent 70%);
  top: -100px; right: -60px;
}
.cat-orb-2 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
  bottom: -80px; left: -40px;
}

.cat-hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.18);
  color: #007bff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.cat-title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #007bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.cat-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

/* ─── Buttons ──────────────────────────────────── */
.cat-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0,123,255,0.25);
  font-family: inherit;
}
.cat-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,123,255,0.35);
}
.cat-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.cat-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
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
.cat-btn-ghost:hover:not(:disabled) { background: #e2e8f0; color: #0f172a; }
.cat-btn-ghost:disabled { opacity: 0.65; cursor: not-allowed; }

.cat-btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.cat-btn-danger:hover:not(:disabled) { background: #fee2e2; border-color: #fca5a5; }
.cat-btn-danger:disabled { opacity: 0.65; cursor: not-allowed; }

/* ─── Table card ───────────────────────────────── */
.cat-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.cat-table-wrap {
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.cat-table {
  width: 100%;
  border-collapse: collapse;
}

.cat-table th {
  background: #f8fafc;
  padding: 0.85rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
  white-space: nowrap;
  border-bottom: 1px solid #f1f5f9;
}

.cat-table td {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.875rem;
  color: #334155;
  vertical-align: middle;
}

.th-actions { text-align: right; }

.cat-row { transition: background 0.12s; }
.cat-row:hover td { background: #f8fafc; }
.cat-row:last-child td { border-bottom: none; }

.td-id { color: #94a3b8; font-size: 0.78rem; font-weight: 600; }

.cat-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cat-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(99,102,241,0.1));
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-name {
  font-weight: 600;
  color: #0f172a;
}

.cat-count-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.cat-count-ico { color: #94a3b8; }
.cat-count { font-size: 0.875rem; color: #64748b; }

.cat-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.cat-act-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  color: #64748b;
}

.cat-act-edit:hover {
  background: rgba(0,123,255,0.08);
  color: #007bff;
  border-color: rgba(0,123,255,0.3);
}

.cat-act-del:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* ─── Footer ────────────────────────────────────── */
.cat-footer {
  padding: 0.9rem 1.25rem;
  border-top: 1px solid #f1f5f9;
}
.cat-total {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ─── Empty ─────────────────────────────────────── */
.cat-empty { text-align: center; padding: 3rem; }
.cat-empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #94a3b8;
}
.cat-empty-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.cat-empty p { font-size: 0.875rem; margin: 0; }

/* ─── Modal ─────────────────────────────────────── */
.cat-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9000;
}

.cat-modal {
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  overflow: hidden;
}

.cat-modal--sm {
  max-width: 380px;
  padding: 2rem 1.75rem 1.5rem;
  text-align: center;
}

.cat-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.cat-modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0,123,255,0.12), rgba(99,102,241,0.12));
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
  flex: 1;
}

.cat-modal-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.cat-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.cat-close-btn:hover { background: #f1f5f9; color: #0f172a; }

.cat-modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cat-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cat-form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}

.cat-form-group input {
  padding: 0.65rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  background: #f8fafc;
}
.cat-form-group input:focus {
  border-color: #007bff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.08);
}
.cat-form-group input::placeholder { color: #94a3b8; }

.cat-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

/* Delete modal */
.cat-del-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.cat-del-text {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 1.5rem;
  text-align: center;
}

/* ─── Spinner ───────────────────────────────────── */
.cat-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.cat-spinner--red {
  border-color: rgba(220,38,38,0.2);
  border-top-color: #dc2626;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Skeleton ──────────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skel-row td { border-bottom: 1px solid #f8fafc; }
.skel-icon { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; }
.skel-name { width: 130px; height: 13px; }
.skel-act  { width: 30px; height: 30px; border-radius: 8px; }

/* ─── Modal transition ──────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; transform: scale(0.96); }

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 768px) {
  .cat-hero  { padding: 1.25rem; }
  .cat-title { font-size: 1.3rem; }
  .cat-table th,
  .cat-table td { padding: 0.7rem 0.85rem; }
}
</style>
