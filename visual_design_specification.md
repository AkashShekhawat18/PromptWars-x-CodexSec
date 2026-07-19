# NeuroFlow AI: Production Visual Design Specification

"Your Autonomous AI Productivity Operating System"

## 1. Aesthetic Paradigm & Design Language
NeuroFlow AI merges the cinematic spatial depth of **Apple Intelligence**, the lightning-fast utility of **Raycast & Cursor**, the organizational elegance of **Linear & Notion**, and the futuristic branding of **OpenAI**. 

**Core Visual Principles:**
- **Spatial UI & Soft Depth:** Interfaces do not sit flat; they float on the Z-axis using multi-layered shadows and backdrop blurs (glassmorphism).
- **High-Contrast Minimalism:** Deep obsidian backgrounds (`#0A0A0C`) contrasted with hyper-legible typography (Inter or Geist) and stark white (`#FFFFFF`) or iridescent neon accents for AI elements.
- **Zero Clutter:** Relentless reduction of borders and dividers. UI elements are separated by whitespace and subtle background shifts.
- **Organic AI:** AI is represented not by generic robot icons, but by fluid, generative 3D WebGL meshes and light blooms.

---

## 2. High-Fidelity Screen Descriptions

*Note: All data displayed adheres to the `[Backend API Blueprint]` and never uses fake placeholders. Empty states are explicitly defined for all data-driven components.*

### 2.1 Landing Page
- **Purpose:** Convert visitors into users by showcasing the AI operating system.
- **Layout:** Full-bleed hero, bento-box feature grid, social proof carousel, interactive terminal demo, footer.
- **Hero 3D Scene:** A mesmerizing, slow-rotating WebGL "Neural Orb" made of glass and glowing particles that reacts to mouse movement.
- **Typography:** Display font in bold, tight tracking for the headline.
- **Grid & Sections:** 12-column grid. Bento-box cards for features have a `backdrop-filter: blur(24px)` over an animated mesh gradient.
- **Animations:** Reveal-on-scroll using GSAP. Elements fade up and in (`y: 30, opacity: 0 -> 1`).

### 2.2 Authentication & Onboarding
- **Purpose:** Frictionless entry.
- **Layout:** Split screen (Desktop). Left: Glassmorphic auth form. Right: Ethereal 3D fluid animation.
- **Buttons:** "Continue with Google" uses the standard OAuth button, but on hover, a subtle inner glow activates.
- **Onboarding:** A step-by-step wizard (Card-based, centered). Soft page transitions (`scale: 0.98 -> 1.0`, crossfade).
- **Empty State:** Initial states show skeleton loaders (pulsing at 1.5s intervals) while fetching the user profile.

### 2.3 Dashboard (The Nexus)
- **Purpose:** The ultimate top-down view of the user's day, orchestrated by AI.
- **Layout:** Left Sidebar (Navigation), Top Bar (Global Search/Command), Main Content Area, Right Sidebar (AI Copilot/Activity).
- **Cards:** Bento layout. 
  - **Priority Tasks:** `← GET /tasks` (Empty: "No high priority tasks today.")
  - **Up Next (Calendar):** `← Calendar Service` (Empty: "Schedule is clear.")
  - **AI Daily Briefing:** `← AI Service`
- **Color Usage:** Background is `#0A0A0C`. Cards are `#141416` with a `1px` inner border of `rgba(255,255,255,0.05)`.
- **Transitions:** Navigating into the dashboard triggers a staggered cascade animation of cards appearing (50ms stagger).

### 2.4 AI Command Center (Raycast Style)
- **Purpose:** Universal action palette.
- **Layout:** A floating modal dead-center on the screen. Overlays a heavy background blur (`blur-3xl`) over the entire app.
- **UI:** A massive, stark input field at the top. Below, a list of suggested actions or RAG search results (`← Document Service`).
- **Micro-Interactions:** When typing, an "AI Thinking" iridescent gradient sweeps across the border of the input field.

### 2.5 Task Manager & Calendar (Linear Style)
- **Purpose:** Manage workload and time.
- **Grid:** Split pane or Kanban board. No visible grid lines—columns are defined by alignment and spacing.
- **Task Cards:** High information density, small typography (`12px` - `14px`). Status icons use crisp SVG iconography.
- **Calendar Timeline:** Fluid, continuously scrolling grid. Current time is a glowing accent line.
- **Empty States:** "No tasks for today." with a beautiful, subtle wireframe illustration of a completed checklist.

### 2.6 Knowledge Vault & Meeting Copilot
- **Purpose:** Document storage, RAG interface, and meeting insights.
- **Layout:** Left list (Documents/Meetings), Right detail pane (Preview/Transcript).
- **Meeting Copilot:** Displays audio waveform, transcript, and AI Extracted Action Items (`← AI Service`).
- **3D Elements:** The "Knowledge Graph" view displays connected documents as a 3D force-directed node graph in WebGL.
- **Loading State:** Shimmering skeleton over the transcript area while the AI processes audio.

### 2.7 Workflow Automation & Analytics
- **Purpose:** Zapier-like automation builder and productivity metrics.
- **Workflow Layout:** An infinite canvas with draggable nodes. 
- **Animations:** Nodes connect via SVG bezier curves. When an active workflow fires, a glowing light pulse travels along the curve.
- **Analytics Cards:** Simple, high-contrast line charts and sparklines. `← GET /analytics`. (Empty: "Not enough data to generate insights yet.")

### 2.8 System States (404, Empty, Error, Success)
- **Empty States:** Ethereal, low-opacity iconography (e.g., an empty glass folder). Text: "No workflows created." + CTA button.
- **Loading:** Linear-style progress bars at the top of the window (`height: 2px`).
- **Success:** A subtle, snappy toast notification slides in from bottom-right.
- **Error:** Shake animation on inputs. Red `#FF453A` text but keeping the dark, muted aesthetic.

---

## 3. 3D Experience Design

NeuroFlow relies on WebGL (Three.js/React Three Fiber) to convey "AI Intelligence" rather than static UI paradigms.

1. **AI Orb (Global AI State):**
   - A persistent, small floating orb in the UI (e.g., bottom right). 
   - **Idle:** Rotates slowly, matte glass texture, faint glow.
   - **Listening:** Expands slightly, pulses to mic input.
   - **Thinking:** Rapidly shifts colors (magenta/cyan/blue), geometry distorts.
2. **Neural Network Backgrounds:** Used in Auth and Hero sections. Millions of particles connected by lines, reacting to cursor proximity (Mouse Parallax).
3. **Glass Panels:** Modals and dropdowns use real-time background blurring, creating physical depth layers.

---

## 4. Motion Design & Animation Specifications

All animations use spring physics (Framer Motion principles) rather than linear/bezier easing for organic, physical realism.

- **Page Transitions:**
  - `initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}`
  - `animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}`
  - `transition={{ type: "spring", stiffness: 260, damping: 20 }}`
- **Card Hover:**
  - Lift Z-axis, cast a stronger shadow, apply a very subtle inner border gradient glow. 
  - `scale: 1.01`, duration: `0.2s`.
- **AI Thinking (Generative State):**
  - Continuous loop. An iridescent gradient mask scrolling across text or borders to indicate processing.
- **Skeleton Loading:**
  - Instead of standard grey pulsing, use a shimmer effect that travels left-to-right at `45deg`, matching the glassmorphic aesthetic.

---

## 5. Responsive Behavior Matrix

- **Desktop (1440px+):** Sidebar expanded. Multi-pane views (List + Detail) side-by-side. Full 3D backgrounds enabled.
- **Laptop (1024px - 1439px):** Sidebar collapsible. Reduced padding. 3D effects optimized (lower geometry count).
- **Tablet (768px - 1023px):** Bottom navigation or hamburger menu replaces sidebar. Split views turn into stack views (tap list to open detail overlay).
- **Mobile (<767px):** Single column. Cards stretch to `100vw` minus padding. 3D backgrounds disabled or replaced by static, high-res WebP images to save battery. Command Center opens as a full-screen bottom sheet.

---

## 6. Final UI Design Review & Improvements

**Review of the Visual Blueprint:**
- **Strength:** The glassmorphism combined with a deep dark mode creates an unmistakably premium, "Pro" tool feel. Strict reliance on spring physics ensures the app feels highly responsive and physical.
- **Strength:** Adhering strictly to real backend API mappings ensures this design doesn't fall into the trap of looking good but being impossible to build or missing edge states.

**Suggested Technical Improvements for Implementation:**
- **Accessibility (a11y):** Dark mode glassmorphism often fails WCAG contrast ratios. 
  - *Mitigation:* We must ensure all primary text is at least `#EAEAEA` against `#0A0A0C` (Contrast ratio > 7:1). Blur layers must have a solid tint fallback for browsers that do not support `backdrop-filter`.
- **Performance:** Heavy WebGL (Three.js) on the dashboard could drain laptop batteries and throttle the main thread.
  - *Mitigation:* Implement `IntersectionObserver` to pause the `requestAnimationFrame` loop for any 3D element not currently visible in the viewport, and completely disable complex 3D rendering on mobile devices.
