---
name: SettingsView personal save is local-only
description: The Edit/Save flow in SettingsView for personal, organization, and shop tabs makes no API call
type: project
---

`saveChanges()` in `SettingsView.vue` only calls `Object.assign(userData.value, editableUser.value)` — no API call. Changes are lost on page reload.

**Why:** The API endpoint for updating user profile details (firstName, lastName, phone, email, org fields, shop fields) was not wired up at implementation time. The notification was changed from `success` to `info` during the 2026-05-01 audit to avoid misleading the user.

**How to apply:** When asked to implement "save profile" or "wire up the settings save button", the missing piece is calling an API endpoint (likely `PATCH web/users/me` or similar) inside `saveChanges()`. The `editableUser.value` already holds the diff-ready data.
