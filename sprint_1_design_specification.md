# NeuroFlow AI: Sprint 1 Visual Design Specifications

"Your Autonomous AI Productivity Operating System"

*Strict Adherence: All data maps to the approved API Blueprint. No fake data, placeholder metrics, or dummy dashboards are used.*

---

## 1. Landing Page

**Purpose:** Convert visitors to signups by visually proving the product is an autonomous AI OS, not just a task manager.

### Layout & Component Placement
- **Grid:** 12-column flex grid, max-width `1440px`.
- **Top Nav:** Fixed, frosted glass (`backdrop-filter: blur(24px)`). Logo left, Navigation center, "Sign In / Get Started" right.
- **Hero Section:** Full viewport height (`100vh`). Massive typography centered.
- **Bento Grid Features:** 2-column or 3-column asymmetric layout below the fold.

### Visual & Typography
- **Background:** Deep obsidian (`#0A0A0C`). 
- **Typography:** `Inter` or `Geist`. 
  - Hero Headline: `84px`, tight tracking (`-0.04em`), white to subtle grey gradient.
  - Subtitle: `20px`, muted grey (`#8A8A93`).
- **3D Effect (AI Orb):** A WebGL particle orb sits behind the hero text, slowly undulating.
- **Glass Effects:** Bento feature cards use `#141416` with 40% opacity, bordered by a 1px solid white at 10% opacity.

### Motion & Micro-interactions
- **Scroll:** Smooth parallax scrolling. The AI Orb scales down and moves to the bottom corner as the user scrolls to the features.
- **Hover:** Feature cards lift (`translateY: -4px`) and reveal a localized radial gradient glow tracking the mouse pointer (Cursor/Linear style hover).

### Responsive
- **Mobile:** Typography scales down (Hero `48px`). Bento grid stacks into a single column. The AI Orb is replaced by a pre-rendered, high-quality WebP looping video to preserve mobile battery.

---

## 2. Authentication (Login / Signup / Forgot Password)

**Purpose:** Frictionless, secure access leveraging the defined JWT/OAuth backend (`← Auth Service`).

### Layout & Component Placement
- **Layout:** Split-screen on desktop.
  - **Left (40%):** The form. Centered vertically and horizontally.
  - **Right (60%):** A sprawling, slow-moving Neural Network 3D WebGL background.
- **Spacing:** `24px` gaps between form inputs.

### Visual & Typography
- **Color:** Input backgrounds are `#1A1A1E` with no visible borders, only a bottom `1px` subtle highlight.
- **Typography:** Labels are small (`12px`), uppercase, and tracking wide (`0.1em`).
- **Buttons:** Primary "Continue" button is stark white `#FFFFFF` with black `#000000` text (high contrast Apple style).

### Motion & Micro-interactions
- **Focus:** When an input is focused, a glowing gradient border smoothly fades in around it.
- **Form Transition:** Switching from Login to Forgot Password doesn't load a new page. The form fields crossfade and resize dynamically using spring physics.
- **Validation (Empty States):** If OAuth fails, or password is short, the input physically shakes (spring animation) and small `#FF453A` (red) text appears below.

### Responsive
- **Mobile:** The right-side 3D visualization disappears. The form centers on the screen with a subtle background mesh gradient.

---

## 3. Onboarding Experience

**Purpose:** Set up the initial state for the user in the database without overwhelming them, collecting just enough data to power the AI OS.

### 3.1 Welcome & Workspace Creation
- **Action:** `POST /workspace`
- **Layout:** A centered, floating glass modal (max-width: `500px`). The background is completely black.
- **UI:** A simple text input: "Name your workspace".
- **Interaction:** Pressing 'Enter' triggers a snappy scale-down and scale-up transition to the next step.

### 3.2 AI Preference Selection
- **Action:** `PATCH /user/preferences`
- **Layout:** A 2x2 grid of selectable glass cards (e.g., "Developer", "Product Manager", "Creator", "Student").
- **Motion:** Clicking a card triggers a micro-explosion of particles inside the card, marking it as active with an iridescent border.

### 3.3 Google Calendar Connection
- **Action:** `GET /auth/google/calendar`
- **Layout:** Centered content. A prominent "Connect Google Calendar" OAuth button.
- **Empty State Logic:** A subtle "Skip for now" link exists. If skipped, the eventual Dashboard Calendar widget will elegantly display: *"Calendar disconnected. Connect to let AI schedule your day."*
- **Animation:** Upon successful connection, a green checkmark morphs from the Google logo using GSAP path morphing.

### 3.4 Knowledge Vault Introduction
- **Action:** `POST /documents/upload`
- **Layout:** A massive drag-and-drop zone with a dashed border (`rgba(255,255,255,0.2)`).
- **Visuals:** An illustration of a vault or folder. 
- **Empty State:** Text explicitly says: "Drop PDFs or Docs here. NeuroFlow will read them to answer your questions later."
- **Motion:** When a file is dragged over, the border solidifies and glows blue. Upon dropping, a progress bar (Linear-style, `2px` thin at the top of the card) races to 100%.
- **Completion:** A master "Enter NeuroFlow" button appears with a pulsing glow, ready to transition the user to the Dashboard.

---

## Accessibility (Global)
- **Contrast:** Ensure all grey text (e.g., `#8A8A93` on `#0A0A0C`) maintains a minimum 4.5:1 contrast ratio.
- **Focus States:** Every button and input has an explicit, visible `:focus-visible` ring for keyboard navigation, distinct from the mouse-hover glow.
- **Reduced Motion:** If `@media (prefers-reduced-motion: reduce)` is detected, all Three.js WebGL backgrounds are disabled, and spring animations are reduced to instant opacity fades.
