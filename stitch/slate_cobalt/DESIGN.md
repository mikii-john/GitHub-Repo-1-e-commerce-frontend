# Design System Specification: The Architectural Minimalist

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Curator**. 

While standard e-commerce platforms focus on density and utility, this system treats digital commerce as a gallery experience. We move beyond the "standard grid" by utilizing intentional white space, high-contrast typography scales, and a philosophy of **Tonal Layering**. The goal is a high-end, editorial feel that prioritizes breathing room and tactile depth over rigid structural lines. By leveraging large radii and soft, ambient lighting, we transform a functional dashboard into a premium, sophisticated environment.

---

### 2. Colors & Tonal Depth
We do not use color merely for decoration; we use it to define architecture.

#### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background creates a natural boundary without the visual "noise" of a stroke.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper.
- **Base Layer:** `surface` (#f8f9fa) for the main canvas.
- **Section Layer:** `surface-container-low` (#f3f4f5) for grouping related content blocks.
- **Card/Action Layer:** `surface-container-lowest` (#ffffff) to elevate interactive elements.
- **Nesting:** Always place a "Lowest" tier card inside a "Low" or "High" container to create an immediate visual hierarchy.

#### The "Glass & Gradient" Rule
To move beyond "out-of-the-box" Tailwind, use Glassmorphism for floating elements (Top Navbars, Tooltips). 
- **Effect:** Apply `surface` with 80% opacity and a `20px` backdrop-blur. 
- **Signature Texture:** For primary CTAs, use a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135° angle. This adds a "soul" to the blue that flat hex codes cannot achieve.

---

### 3. Typography
We use **Inter** as our typographic backbone, but we apply an editorial scale to create a clear "voice."

*   **Display (lg/md):** Reserved for hero marketing sections and empty states. Use a tighter letter-spacing (-0.02em) to feel authoritative.
*   **Headline (sm/md/lg):** Use for page headers. These should be `on_surface` (#191c1d) with semi-bold weights to anchor the eye.
*   **Title (md/lg):** Used for product names and card titles. This is the "label" of our gallery.
*   **Body (md):** The workhorse. Always ensure a line-height of 1.6 to maintain the "editorial" feel.
*   **Label (sm/md):** All-caps with +0.05em letter spacing for metadata (e.g., "SKU: 12345").

---

### 4. Elevation & Depth
Depth is achieved through light and shadow, not lines.

#### The Layering Principle
Instead of a shadow on every card, use **Tonal Layering**. A white card (`surface_container_lowest`) on a light gray background (`surface_container_low`) provides enough contrast to indicate "lift" without the clutter of a drop shadow.

#### Ambient Shadows
When a "floating" effect is required (e.g., a product card on hover):
- **Shadow:** `0px 20px 40px rgba(25, 28, 29, 0.06)`
- **Coloring:** The shadow must be a tinted version of the `on_surface` color, never pure black.

#### The "Ghost Border" Fallback
If a border is required for accessibility in data tables:
- **Rule:** Use `outline_variant` at **20% opacity**. 100% opaque borders are strictly forbidden.

---

### 5. Components

#### Buttons
*   **Primary:** Gradient (Primary to Primary Container), `lg` roundedness (2rem), `title-sm` typography.
*   **Secondary:** `surface-container-high` background, no border, `on_surface_variant` text.
*   **Interactive State:** On hover, primary buttons should scale 1.02x with a soft ambient shadow.

#### Cards (Product & Orders)
*   **Style:** `surface-container-lowest` background, `DEFAULT` (1rem) or `lg` (2rem) radius.
*   **Constraint:** No dividers. Use `body-md` for descriptions and `label-md` for categories, separated by `1.5rem` of vertical space.

#### Status Indicators (The "Pill" System)
*   **Pending (Yellow):** Background: `#fef9c3`, Text: `#854d0e`.
*   **Paid (Blue):** Background: `primary_fixed`, Text: `on_primary_fixed_variant`.
*   **Shipped (Indigo):** Background: `tertiary_fixed`, Text: `on_tertiary_fixed_variant`.
*   **Delivered (Green):** Background: `#dcfce7`, Text: `#166534`.
*   **Format:** All status indicators must use `full` (9999px) roundedness and `label-sm` bold typography.

#### Data Tables (Orders Dashboard)
*   **Philosophy:** Remove all vertical and horizontal grid lines.
*   **Design:** Use a `surface-container-lowest` background for the entire table. Use `surface-container-low` as a subtle "zebra stripe" for alternating rows.
*   **Header:** `label-md` weight, uppercase, `outline` color.

#### Sidebar Navigation
*   **Style:** `surface` background. Selected state uses a vertical "indicator" bar that is `4px` wide with a `full` radius, colored in `primary`.
*   **Active Item:** Transition the background of the active nav item to a 5% opacity version of `primary`.

---

### 6. Do’s and Don’ts

#### Do
*   **Do** use the Spacing Scale religiously (increments of 8px).
*   **Do** lean into `xl` (3rem) roundedness for large containers to emphasize the "Soft Minimalist" aesthetic.
*   **Do** use semi-transparent overlays for modals to keep the background context visible.

#### Don’t
*   **Don't** use 1px solid borders to separate sections. Use background color shifts.
*   **Don't** use pure black (#000) for text. Always use `on_surface` (#191c1d) or `secondary` (#515f74) for a softer, more premium look.
*   **Don't** crowd elements. If a design feels "busy," add 16px of padding to the container.
*   **Don't** use standard "drop shadows" with high opacity. If it looks like a shadow, it’s too dark. It should look like a "glow."