# Design System Strategy: Human-Technical Editorial

## 1. Overview & Creative North Star: "The Digital Architect’s Atelier"
The Creative North Star for this design system is **"The Digital Architect’s Atelier."** 

Standard portfolios for developers often fall into two traps: the overly sterile, "terminal-style" dark mode or the generic, template-driven corporate layout. This system rejects both. It treats the Head of Web Development’s work as a craft—combining the rigid, structural logic of backend architecture with the tactile, warm intentionality of a physical design studio.

We break the "template" look through **Logical Asymmetry**. While elements are technically snapped to a precise grid (representing code structure), the visual weight is distributed unevenly. High-contrast typography scales and overlapping "glass" containers create a sense of depth and curation, moving the experience from a "web page" to a "digital monograph."

---

## 2. Colors & Tonal Depth
The palette transitions from the cold precision of deep technical blues to the organic warmth of earth tones.

*   **Primary Logic (`#041627`)**: Use this for high-authority moments—navigation backgrounds, hero text, and primary actions. It represents the "backend" strength.
*   **Secondary Logic (`#9a442d`)**: Our Terracotta accent. Use this sparingly for "human" touchpoints: text links, focus states, or a singular decorative element in a technical section.
*   **Neutral Foundation (`#faf9f8`)**: This isn't a "stark white"; it’s a soft, paper-like surface that prevents the technical elements from feeling abrasive.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. 
Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background creates a clean, architectural break without the visual clutter of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To create depth:
1.  **Base:** `surface` (`#faf9f8`)
2.  **Sectioning:** `surface-container-low` (`#f4f3f2`)
3.  **Interactive Elements:** `surface-container-lowest` (`#ffffff`) 
Nesting a `lowest` card inside a `low` container creates a soft, natural lift that suggests a "sheet of paper" resting on a desk.

### The "Glass & Gradient" Rule
To add soul to the technical grid, use **Glassmorphism** for floating navigation or overlay cards. Use `surface_variant` at 60% opacity with a `20px` backdrop-blur. For primary CTAs, apply a subtle linear gradient from `primary` (`#041627`) to `primary_container` (`#1a2b3c`) at a 135-degree angle to provide a sophisticated, metallic sheen.

---

## 3. Typography: The Editorial Voice
The typography is a dialogue between **Manrope** (The Humanist) and **Space Grotesk** (The Technical).

*   **Display & Headlines (Manrope)**: These should be set with tight letter-spacing (-0.02em). Use `display-lg` (3.5rem) for hero statements to establish a "big-picture" leadership presence.
*   **Body (Inter)**: The workhorse. Inter provides maximum readability for technical case studies. Ensure `body-lg` uses a generous line-height (1.6) to lean into the "Editorial" feel.
*   **Labels (Space Grotesk)**: This is our "Code" nod. Use `label-md` for metadata, categories, and technical specs. Its geometric, monospaced-adjacent feel provides the "Technical" anchor to the "Human" Manrope headers.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "atmosphere."

*   **The Layering Principle**: Avoid the `z-index` arms race. Stack surface tiers. A project card should be `surface-container-highest` when hovered, sitting on a `surface-container` background.
*   **Ambient Shadows**: When a floating element (like a modal) is required, use an extra-diffused shadow: `0 24px 48px -12px rgba(26, 28, 28, 0.08)`. The tint is derived from `on-surface`, making it feel like a natural occlusion of light.
*   **The "Ghost Border"**: If accessibility requires a container edge, use `outline-variant` (`#c4c6cd`) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Style Guide

### Buttons
*   **Primary**: `primary` background with `on-primary` text. Use `DEFAULT` (0.25rem) roundedness for a precision-tool feel. 
*   **Secondary**: `secondary_container` background. This is the "Human" button—use it for "Get in Touch" or "About Me."
*   **Tertiary**: Ghost style. No background, `primary` text, with a `2px` underline that expands on hover.

### Cards & Projects
*   **Constraint**: No dividers. Use `spacing-8` (2.75rem) to separate internal content.
*   **Structure**: A `surface-container-low` base. Image at the top should have a subtle 10% black inner-glow to feel "recessed" into the card.

### Text Inputs
*   **Style**: Bottom-border only or very light `surface-container-highest` fills. 
*   **Focus**: Transition the bottom border to `secondary` (Terracotta) to provide a "warm" response to user input.

### Additional Component: "The Tech Stack Chip"
*   Use `label-sm` (Space Grotesk). Background: `primary_fixed_dim`. Text: `on_primary_fixed`. This creates a "blueprint" look for technical skills that contrasts beautifully against the warm page background.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical padding. Give the right side of a text block more breathing room than the left to mimic high-end magazine layouts.
*   **Do** use authentic photography. A Head of Dev should show the "messy" reality of a workshop—whiteboards, sketches, or a high-quality portrait with natural lighting.
*   **Do** snap everything to the `0.7rem` (spacing-2) base unit. Even if the layout looks "loose," the underlying math must be rigid.

### Don’t:
*   **Don’t** use pure black `#000000`. It breaks the organic "Human" feel of the palette. Use `primary` or `on_surface`.
*   **Don’t** use heavy drop shadows. If it looks like it’s "floating" more than 5mm off the page, it's too much.
*   **Don’t** use icons as purely decorative items. Icons must be "Technical"—think schematics, arrows, and data nodes. For "Human" elements, use photography or typography.