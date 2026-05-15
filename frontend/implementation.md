# Habit Tracker Frontend Implementation

This document outlines the architecture, design, and roadmap for the Habit Tracker frontend.

## 🎨 Design System

### Colors (Derived from CSS Variables)
- **Primary/Accent:** `#aa3bff` (Light) / `#c084fc` (Dark) - Used for buttons, active states, and highlights.
- **Background:** `#ffffff` (Light) / `#16171d` (Dark).
- **Text:** `#6b6375` (Light) / `#9ca3af` (Dark).
- **Headings:** `#08060d` (Light) / `#f3f4f6` (Dark).
- **Borders:** `#e5e4e7` (Light) / `#2e303a` (Dark).

### Typography
- **Heading:** `system-ui, 'Segoe UI', Roboto, sans-serif` (Clean, modern professional).
- **Body:** `system-ui, 'Segoe UI', Roboto, sans-serif` (High readability).
- **Monospace:** `ui-monospace, Consolas, monospace` (For stats and counters).

---

## 🛣️ Routing & Access Control

### Public Routes
- `/`: **Landing Page** - Product overview and marketing.
- `/login`: **Login Page** - User authentication.
- `/register`: **Signup Page** - New user registration.

### Protected Routes (Requires JWT)
- `/dashboard`: **The Pulse** - Today's habits, progress rings, and quick check-ins.
- `/habits`: **Habit Library** - Management of all active, paused, and archived habits.
- `/habits/new`: **Creator** - Intelligent form to set targets and schedules.
- `/habits/:id`: **Deep Dive** - Historical heatmap, detailed metrics, and habit settings.
- `/badges`: **Achievement Hall** - Visual gallery of earned and upcoming rewards.

---

## 📄 Page Breakdown

### 1. Landing Page
- **Hero Section:** High-impact typography with a call-to-action (CTA).
- **Features Grid:** 
    - *Flexible Scheduling*: Explain Daily, Specific Days, and Weekly Count.
    - *Smart Streaks*: Mention how exceptions (illness/vacation) protect progress.
    - *Progress Analytics*: Highlight streaks and completion rates.
- **Mockup Preview:** A visual representation of the dashboard.

### 2. Dashboard (Home)
- **Today's Due:** A "Focus List" of habits scheduled for today.
- **Stats Row:** Total Active, Global Completion Rate, and Badges Earned.
- **Quick Action:** Single-click completion with Framer Motion celebrations.

### 3. Habit Management
- **Creation Wizard:** Using Zod for validation, ensuring valid schedules and targets.
- **Filtering:** Search by name, filter by category or status.
- **Heatmap:** A GitHub-style contribution grid for habit consistency.

### 4. Auth System
- **JWT Provider:** A React Context to wrap the application, providing `user` state and `logout` function.
- **Persistence:** Securely storing tokens in `localStorage` with Axios interceptors for automatic injection.

---

## 🛠️ Technical Roadmap

1. **Step 1: Auth & Protection** - Implement the `AuthProvider` and `ProtectedRoute` components.
2. **Step 2: Landing & Branding** - Build the high-conversion landing page and navigation.
3. **Step 3: Dashboard & API** - Connect to `/api/dashboard` and implement the "Due Today" logic.
4. **Step 4: Habit CRUD** - Full management of habits with optimistic UI updates.
5. **Step 5: Polish** - Add Dark Mode toggle, Framer Motion transitions, and mobile responsiveness.
