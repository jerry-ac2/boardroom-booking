# UX Audit Report

## Phase 1: Tech Stack & Pattern Summary

- **Framework**: React (React 18) with Vite.
- **Routing**: React Router v6 via `BrowserRouter` in `src/main.jsx` and `<Routes>` in `src/App.jsx`.
- **CSS methodology**: Hybrid. The app uses Tailwind utility classes in JSX (`w-4.5/12`, `md:flex-row`, etc.) plus global CSS in `styles.css` and `responsive.css`.
- **Component library / patterns**:
  - Custom button component in `src/components/ui/button.jsx`.
  - Custom popover implementation with Floating UI in `src/components/ui/popover.jsx`.
  - No major UI library like MUI/Chakra; the app uses a lightweight internal design system.
  - Existing toast notifications are provided by `react-toastify`.
- **Testing**: No visible test files found in the repository.

## Phase 2: UX Inventory

### Critical Issues (Broken a11y / major friction)

1. `src/pages/Login.jsx`
   - Password input has no visibility toggle.
   - Validation is only on submit and uses global toast warnings rather than inline field feedback.
   - Missing proper autocomplete values for browser autofill.
   - `button` disabled state is only used while loading; invalid form state is not enforced.

2. `src/pages/Signup.jsx`
   - Password input has no visibility toggle.
   - Form validation is only on submit and uses toast warnings.
   - Inputs lack semantic association with labels in several cases.
   - No proper `autocomplete` values.

3. `src/pages/Admin.jsx`
   - Uses `prompt()` and `confirm()` for destructive actions. This is not accessible and produces inconsistent UX.
   - No accessible modal/dialog confirmation component.
   - No skeleton or loading placeholder while booking data loads.
   - Large table and action buttons are still too dense on mobile.

4. `src/components/ui/popover.jsx`
   - Popover includes escape/outside-click handling, but no explicit focus trap implementation.
   - No `role="dialog"` or other accessibility semantics on popover content.

5. `src/pages/Dashboard.jsx`
   - Initial data load has no dedicated loading state or skeleton.
   - Empty booking state is minimal and not action-oriented.
   - Logout and admin navigation are visually close; no active state for current route.

### High Severity Issues (Major UX improvement areas)

1. `src/pages/Admin.jsx` / `src/pages/Dashboard.jsx`
   - No skeleton loading screens for page-level fetches.
   - No route transition animation to soften page changes.
   - No scroll restoration behavior when navigating back from admin/dashboard.
   - No breadcrumbs or orientation aids for deeper navigation.

2. `src/pages/Admin.jsx`
   - Table `select` checkboxes are raw and not grouped with `aria-label` or accessible row interaction.
   - `exportAllExcel` / `exportAllPDF` buttons have no status feedback during export.

3. `src/pages/Dashboard.jsx`
   - Hardcoded ICS link points to `localhost:3000`; this is a production-issue risk.
   - The booking card list has no meaningful empty state CTA.

4. `src/pages/Login.jsx` and `src/pages/Signup.jsx`
   - No keyboard shortcut support or form submission via Ctrl/Cmd+Enter.
   - Toast-driven error flows are not ideal for screen reader users.

5. `src/components/customInput.jsx`
   - Minimal component with no accessibility or UX value.
   - Could be replaced with a reusable input component supporting labels, error messages, and password toggle.

### Medium Severity Issues (Polish / consistency)

1. `styles.css` / `responsive.css`
   - Focus outline styling is not audited; there may be insufficient `:focus-visible` support.
   - Mobile table/card layout is improved but still could be polished for spacing and touch targets.

2. `src/pages/Login.jsx`, `src/pages/Signup.jsx`
   - Anchor tags use native `<a href>` instead of React Router `<Link>` for internal SPA navigation.

3. `src/pages/Admin.jsx`
   - Action buttons inside the table are dense and have inconsistent visual hierarchy.
   - No explicit empty state view when there are zero bookings.

4. `src/pages/Dashboard.jsx`
   - The admin action link is a plain anchor instead of a router link.
   - `DailySchedule` panel and booking list have no skeleton state while data loads.

5. `src/App.jsx`
   - No route transition wrapper or animated page transitions.

## Phase 3: Initial Implementation Scope

### Priority Fixes
- `src/pages/Login.jsx`: password visibility toggle, inline validation, proper autocomplete, keyboard behavior, and loading button state.
- `src/pages/Signup.jsx`: same form improvements as login.
- `src/pages/Admin.jsx`: replace browser prompt/confirm with modal confirmation, improve mobile table cards, add empty state, add skeleton/loading state.
- `src/pages/Dashboard.jsx`: add loading skeleton, improve empty bookings state, fix hardcoded ICS production link.
- `src/components/ui/popover.jsx`: add accessibility roles and focus trap support.
- `src/components/customInput.jsx`: retire or replace with a proper reusable input component.
- `src/App.jsx` / `src/main.jsx`: preserve routing while adding route transition fade.

### Additional UX improvements to implement later
- Scroll restoration and route transition animations.
- Better keyboard focus indicators in CSS.
- Global `beforeunload` protection for unsaved form state if applicable.
- Centralized error/toast patterns and confirmation dialogs.

## Audit Summary

- Total critical files: `src/pages/Login.jsx`, `src/pages/Signup.jsx`, `src/pages/Admin.jsx`, `src/components/ui/popover.jsx`, `src/pages/Dashboard.jsx`
- Total high-priority UX patterns: form validation, loading skeletons, accessible modals, destructive action confirmation, route feedback.
- No existing test coverage found; new UI states should include unit tests for major components.

---

### Next Step
If you confirm, I will begin implementation starting with the form UX refactor and accessible confirmation workflow.
