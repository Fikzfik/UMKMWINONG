---
name: Heritage & Growth
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#42493e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#7d562d'
  on-secondary: '#ffffff'
  secondary-container: '#ffca98'
  on-secondary-container: '#7a532a'
  tertiary: '#403923'
  on-tertiary: '#ffffff'
  tertiary-container: '#585038'
  on-tertiary-container: '#cec2a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#f0bd8b'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#623f18'
  tertiary-fixed: '#eee2c2'
  tertiary-fixed-dim: '#d2c6a7'
  on-tertiary-fixed: '#211b08'
  on-tertiary-fixed-variant: '#4e462f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand personality of this design system is **Professional, Culturally-Rich, and Nurturing**. It aims to empower local micro-entrepreneurs (MSMEs) by bridging the gap between traditional village values and modern digital commerce. The target audience includes local villagers, urban tourists, and potential business partners who value authenticity and community growth.

The design style is a **Modern-Organic** hybrid. It utilizes a sophisticated "Clean Corporate" foundation enhanced by "Soft-Tactile" elements. By using high-quality serif typography paired with generous whitespace, the UI evokes an emotional response of reliability and warmth. It avoids the coldness of pure tech startups in favor of a "Digital Town Square" atmosphere—approachable, stable, and proud of its roots.

## Colors

The palette is rooted in the natural landscape of a thriving village.
- **Primary (#2D5A27):** A deep, lush green representing agriculture, growth, and sustainability. Used for high-priority actions and brand-defining elements.
- **Secondary (#D4A373):** A warm earth tone reminiscent of clay, wood, and craft. This color provides a human touch and highlights MSME branding.
- **Tertiary (#FAEDCD):** A soft parchment tone used for secondary backgrounds and subtle highlights, reducing the harshness of pure white.
- **Neutral (#F8F9FA):** A clean, cool-tinted light gray for backgrounds to maintain a modern, airy feel.

Use the primary green for structural elements (navigation, footers) and the secondary earth tone for decorative accents and call-to-action buttons that focus on commerce and craftsmanship.

## Typography

This design system employs a **transitional typographic pairing** to signal both heritage and efficiency.
- **Headlines:** Playfair Display provides an elegant, editorial feel. Use this for page titles, section headers, and quotes. Its high-contrast strokes reflect the craftsmanship of local products.
- **Body & Labels:** Inter is used for all functional text. Its high legibility ensures that information about local government services and product descriptions is accessible to all age groups.

On mobile devices, scale the Display and Headline levels down to prevent excessive line-breaking. Maintain a generous line height (1.6) for body text to ensure readability for a diverse demographic.

## Layout & Spacing

The layout philosophy follows a **Fluid-Fixed Hybrid**. On desktop, content is contained within a 1280px central track using a 12-column grid. On mobile, a single-column fluid layout is used with 20px side margins.

A "Generous Whitespace" rule is applied to avoid visual clutter. Use `lg` (48px) and `xl` (80px) spacing for vertical section separation to allow each MSME category or village update to breathe. Gutters should be maintained at 24px to ensure distinct separation between cards in a grid.

## Elevation & Depth

To maintain a friendly and trustworthy vibe, this design system uses **Ambient Shadows** and **Tonal Layering**. 
- **Surfaces:** Use the Tertiary color (#FAEDCD) to create subtle contrast for background sections.
- **Shadows:** Use a very soft, diffused shadow for interactive cards. The shadow should have a large blur radius (20-30px) and a low opacity (8-10%) with a slight tint of the Primary green to keep it "organic" rather than "synthetic."
- **Hover States:** Elements should lift slightly (translate -4px) and the shadow intensity should increase marginally to provide tactile feedback without looking aggressive.

## Shapes

The shape language is defined by **pronounced roundedness**. 
- Standard UI elements (buttons, inputs) use a 0.5rem (8px) radius.
- Large containers like product cards, image galleries, and feature sections use `rounded-xl` (1.5rem / 24px) to create a soft, welcoming, and non-threatening aesthetic.
- Avatars and status chips should use pill-shaped (full-round) corners.

## Components

- **Buttons:** Primary buttons use the Secondary earth tone with white text for a warm call-to-action. Secondary buttons should use an outline style with the Primary green.
- **Cards:** Product and MSME cards should feature a large image with a 24px top-rounded corner. The text area below should have generous padding (24px) and use Playfair Display for the title.
- **Input Fields:** Use a subtle Tertiary background (#FAEDCD) instead of a stark white, with a 1px border that turns Primary green on focus.
- **Chips/Badges:** Use low-saturation versions of the primary green to indicate categories (e.g., "Food," "Crafts," "Tourism").
- **Lists:** Use custom icons (e.g., stylized leaves or local motifs) instead of standard bullets to reinforce the cultural richness of the village.
- **Navigation:** The navigation bar should be clean and white, using a subtle bottom border rather than a heavy shadow to maintain the "airy" feel of the system.