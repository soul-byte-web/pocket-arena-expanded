---
name: Add mobile responsive modal fixes
about: Adds css/mobile-fixes.css and injects it in index.html
---

This pull request adds a new stylesheet (css/mobile-fixes.css) with responsive fixes for modals and mobile layout, ensures the site header remains visible over modals, constrains modal height, enables internal scrolling, and makes action buttons touch-friendly.

Please test on small devices and in Chrome DevTools (mobile emulation). Steps:
1. Open the home screen modal/card and verify the header stays visible.
2. Ensure modal content scrolls when viewport is small.
3. Confirm buttons are full-width and tappable.

If anything needs tweaking, I'll update the mobile-fixes branch.