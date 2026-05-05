---
name: Project Overview
description: Tech stack, auth pattern, and key architectural decisions for cpos-frontend
type: project
---

Vue 3 (Composition API, script setup) + Vite SPA. Plain JavaScript — no TypeScript. vue-i18n v11, vue-router v5, axios, lucide-vue-next icons.

Auth uses a cookie+localStorage hybrid: `accessToken` and `refreshToken` stored in localStorage; `withCredentials: true` on axios for HttpOnly cookie support. Route guard reads `refreshToken` from localStorage to determine auth state. Refresh logic lives in the axios response interceptor in `src/services/api.js`.

**Why:** The backend appears to support both token styles. The router guard is intentionally simple — client-side only, real protection is on the API.

**How to apply:** When touching auth or protected routes, account for both the localStorage token check and the cookie. Don't replace one with the other.

API base URL comes from `VITE_API_BASE_URL` env var, falls back to `http://localhost:8080/api/v1/` for local dev.

Locale is handled via `getApiLocaleTag()` in `src/utils/localeApi.js` — maps `uz`/`oz`/`ru` to backend-expected locale strings sent via `?lang=`, `Accept-Language`, and `X-Locale` headers.

Notification system is a shared singleton via `useNotification()` composable — module-level ref, not provide/inject. AppNotification component is mounted in App.vue.
