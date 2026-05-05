---
name: AppNotification warning type support
description: The warning notification type is used in the codebase and must be styled in AppNotification
type: feedback
---

`useNotification().showNotification({ type: 'warning', ... })` is called in SettingsView's `updateSecuritySettings`. AppNotification uses `` `notif--${notification.type}` `` as a class, so `notif--warning` must have CSS rules.

**Why:** Without the CSS, warning notifications render with no icon color and no top accent bar, appearing identical to an unstyled state.

**How to apply:** Always add `notif--warning` styles to AppNotification when touching the notification system. The warning color palette used is amber: icon color `#ca8a04`, accent gradient `#f59e0b → #fbbf24`.
