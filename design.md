# StudNow Design System

A high-fidelity, Apple-inspired mobile design system focused on "User-for-User" simplicity, minimalist aesthetics, and functional elegance.

## 🎨 Color Palette

### Brand Colors
- **Primary (Blue):** `#007AFF` (System Blue) - Used for primary actions, active navigation states, and progress indicators.
- **Surface:** `#FAFAFE` - The primary background color for a clean, off-white aesthetic.
- **Surface Dim:** `#DAD9DF` - Used for subtle borders and secondary backgrounds.
- **Surface Container:** `#FFFFFF` - Pure white for card backgrounds and elevated surfaces.

### Functional Colors
- **Success:** `#34C759` - Active status indicators and completed steps.
- **Error/Destructive:** `#FF3B30` - Logout actions and critical alerts.
- **Text Primary:** `#1A1A1A` - Headings and primary body copy.
- **Text Secondary:** `#6B7280` - Captions, labels, and message previews.

## Typography
- **Primary Font:** Inter / SF Pro
- **Headings:** Bold weight, tracking-tight (e.g., `-0.02em`), used for page titles and section headers.
- **Body:** Medium/Regular weight for legibility.
- **Labels:** Semibold, smaller scale (10-12px) for navigation and status tags.

## 📐 Layout & Spacing
- **Border Radius:** 
  - `ROUND_EIGHT`: 8px for small components/tags.
  - `ROUND_TWENTY`: 20px for chat bubbles and buttons.
  - `ROUND_THIRTY_TWO`: 32px for main containers, modals, and profile sections.
- **Margins:** Wide page margins (typically 20px) to provide "breathing room" and a premium feel.
- **Elevation:** "Shadow-sm" or subtle soft shadows (e.g., `0 10px 30px rgba(0,0,0,0.04)`) to define depth without harsh lines.

## ✨ Components & Patterns

### Glassmorphism
- Used for Top App Bars and Bottom Navigation.
- **Effect:** `backdrop-blur-md` with `bg-white/70`.

### Navigation
- **Bottom Bar:** 4-tab layout (Explore, Groups, Chat, Profile) with minimalist icons and pill-shaped active state indicators.
- **Top Bar:** Large titles with minimalist trailing action icons (QR, Search, Notifications).

### Interaction States
- **Buttons:** Smooth transitions, active scaling (e.g., `active:scale-95`).
- **Progress Bars:** Thin, elegant lines with soft blue tints and descriptive micro-copy.

## 🧩 Shared Components Reference
- **TopAppBar:** Small or Medium, standard Apple alignment.
- **BottomNavBar:** Label + Icon type, 4 destinations.
- **Chat Bubbles:** High corner radius (20px), Primary Blue for sender, Light Gray for receiver.
- **Pill Tags:** High corner radius, light gray background, for interest and category tagging.
