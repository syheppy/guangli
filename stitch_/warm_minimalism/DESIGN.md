---
name: Warm Minimalism
colors:
  surface: '#fff8f5'
  surface-dim: '#e8d7ce'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ea'
  surface-container: '#fceae1'
  surface-container-high: '#f6e5dc'
  surface-container-highest: '#f0dfd6'
  on-surface: '#221a14'
  on-surface-variant: '#554339'
  inverse-surface: '#382e28'
  inverse-on-surface: '#ffede4'
  outline: '#887368'
  outline-variant: '#dbc1b5'
  surface-tint: '#99460a'
  primary: '#964407'
  on-primary: '#ffffff'
  primary-container: '#b65c21'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb68e'
  secondary: '#605e59'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2db'
  on-secondary-container: '#67645f'
  tertiary: '#006480'
  on-tertiary: '#ffffff'
  tertiary-container: '#007ea1'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb68e'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#773300'
  secondary-fixed: '#e6e2db'
  secondary-fixed-dim: '#cac6bf'
  on-secondary-fixed: '#1d1c18'
  on-secondary-fixed-variant: '#484742'
  tertiary-fixed: '#bce9ff'
  tertiary-fixed-dim: '#70d2fa'
  on-tertiary-fixed: '#001f2a'
  on-tertiary-fixed-variant: '#004d63'
  background: '#fff8f5'
  on-background: '#221a14'
  surface-variant: '#f0dfd6'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 40px
  container-padding-mobile: 20px
  card-gap: 24px
  section-margin: 48px
  table-row-padding: 18px
---

## Brand & Style

This design system draws from the Japanese "Cream Style" (奶油风) aesthetic, tailored for a B2B management context. It prioritizes emotional comfort, clarity, and a sense of "soft professional" atmosphere. The goal is to reduce the cognitive load and stress typically associated with dense backend data by using a warm, organic palette and generous whitespace.

The style is a hybrid of **Minimalism** and **Tactile Softness**. It moves away from the cold, clinical nature of traditional SaaS platforms toward an environment that feels more like a modern, physical studio space. 

**Core Tenets:**
- **Softness over Sharpness:** Every interaction and container uses organic, rounded forms.
- **Breathable Data:** High padding and the absence of harsh vertical lines allow data to flow naturally.
- **Warmth as Professionalism:** Using earth tones and cream bases to create an inviting yet focused workspace.

## Colors

The palette is centered around a low-contrast, warm base to minimize eye strain during long work sessions.

- **Primary (#C2652A):** A muted warm orange used for call-to-actions, active navigation states, and critical interaction points.
- **Canvas (#FAF5EE):** The "Cream" base that replaces traditional grays or whites for the main application background.
- **Surface (#FFFFFF):** Pure white is reserved exclusively for content cards and floating modals to create a subtle elevation against the cream canvas.
- **Typography:** Deep brown-grey (#3A302A) provides high legibility without the harshness of pure black, while the secondary grey (#78706A) handles metadata and descriptions.

## Typography

The design system utilizes **Hanken Grotesk** for its clean, contemporary geometry and professional weight distribution. 

The typographic hierarchy is intentionally restrained. Headlines use a slightly tighter letter-spacing and a semi-bold weight to establish authority without appearing aggressive. Body text is optimized for readability with a generous line-height to maintain the "airy" feel of the brand. For data-heavy views, use `body-md` to ensure information density remains manageable without cluttering the soft visual style.

## Layout & Spacing

This design system employs a **Fixed-Fluid Hybrid** model. Navigation and sidebars are fixed, while the main content area utilizes a fluid 12-column grid with exceptionally wide margins to emphasize the "minimalist" aesthetic.

**Spacing Rules:**
- **No Vertical Dividers:** Spatial separation is achieved through white space or subtle tonal shifts rather than lines.
- **Horizontal Flow:** Table rows and list items should have high vertical padding (`table-row-padding`) to create a sense of luxury and ease.
- **Margins:** Desktop views should maintain a minimum of 40px outer margin to keep the content centered and focused.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Extremely Soft Shadows**.

- **Level 0 (Canvas):** The #FAF5EE cream background.
- **Level 1 (Surface):** Pure white cards (#FFFFFF) using a very soft, diffused shadow (Blur: 15px, Spread: -2px, Opacity: 4% of #3A302A).
- **Level 2 (Interactive):** Hover states on cards or dropdowns should increase the shadow diffusion slightly rather than changing the border color.
- **Zero Lines:** Avoid 1px borders for card containers. Use the contrast between the white surface and cream canvas to define boundaries.

## Shapes

The shape language is defined by **Large Rounded Corners (rounded-2xl)**.

- **Main Cards:** 24px (1.5rem) corner radius.
- **Buttons & Inputs:** 12px (0.75rem) corner radius.
- **Capsule Tags:** Fully rounded (999px) to create a distinct visual pill shape that contrasts against the rectangular card structure.
- **Selection States:** Focus rings should be soft and follow the object's border radius exactly, using a 3px offset.

## Components

### Buttons
Primary buttons use the Warm Orange (#C2652A) with white text. Secondary buttons should be a subtle tint of the primary color (5% opacity) or ghost buttons with deep brown-grey text.

### Capsule Tags
Used for status and categorization. They should have a background that is a very light tint of their semantic color (e.g., Success = Soft Mint, Warning = Soft Amber) with a semi-bold text weight.

### Elegant Tables
Tables must not have vertical borders. Horizontal borders should be extremely faint (#F0EAE2) or replaced entirely by alternating row hover states. Vertical row padding is set to 18px to ensure the data feels uncrowded.

### Input Fields
Inputs use the Canvas color (#FAF5EE) as their fill when nested inside a White card to create a "recessed" look. On focus, the border shifts to the Warm Orange.

### Rounded Switches
Toggles must be pill-shaped. The "Off" state should be a neutral taupe, and the "On" state should be the Warm Orange. The switch knob should always be pure white with a small soft shadow.

### Cards
All content must live within Level 1 White cards. These cards should have a consistent 32px internal padding to ensure content does not feel "trapped" by the rounded corners.