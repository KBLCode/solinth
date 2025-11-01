# Solinth Brand Color Palette - OFFICIAL

## Last Updated: 2025-11-01

## Light Mode Colors

### Primary
- **Solar White** — `#FFFFFF`
  - Clean, minimalist base
  - Represents light, clarity, and innovation
  - Use for: Main backgrounds, cards, surfaces

### Highlight / Accent
- **Radiant Amber** — `#FFA845`
  - Warm, optimistic orange inspired by the rising sun
  - Use for: Buttons, CTAs, focus states, highlights, glows
  - **NEVER use for text** - only for accents and UI elements

### Supporting / Secondary
- **Midday Sand** — `#EADAC0`
  - Soft beige-neutral that complements white
  - Adds warmth without overwhelming
  - Use for: Secondary backgrounds, subtle accents

- **Dusk Slate** — `#2E3440`
  - Deep, sophisticated charcoal
  - **PRIMARY TEXT COLOR for light mode**
  - Use for: Typography, icons, dark elements
  - WCAG AA compliant on white backgrounds

- **Sky Mist** — `#D8E3F0`
  - Gentle cool tint to offset warmth
  - Provides calm contrast
  - Use for: Muted backgrounds, subtle borders

### Optional Gradient
- **Solar Gradient**: `#FFA845 → #FFD67C`
  - For hero elements, subtle backgrounds, brand illustrations
  - Use sparingly for impact

## Dark Mode Colors

### Primary Background
- **Eclipse Black** — `#0F1114`
  - Deep charcoal base
  - Clean, elegant dark mode foundation
  - Use for: Main dark backgrounds

### Surface / Secondary Background
- **Midnight Graphite** — `#1C1F24`
  - Slightly lighter than Eclipse Black
  - Use for: Panels, cards, elevated surfaces

### Text / Foreground
- **Solar White** — `#FFFFFF`
  - **PRIMARY TEXT COLOR for dark mode**
  - Clean and crisp against dark backgrounds
  - WCAG AA compliant on dark backgrounds

- **Sky Mist** — `#D8E3F0`
  - For secondary text, icons, muted UI elements
  - Use at 60% opacity for subtle text

### Accent / Highlight
- **Radiant Amber** — `#FFA845`
  - Signature Solinth accent
  - Pops beautifully on dark surfaces
  - Use for: Buttons, CTAs, focus states, highlights, glows
  - **NEVER use for text** - only for accents

### Supporting Neutrals
- **Lunar Sand** — `#B7A98B`
  - Muted, warm beige
  - Echoes "Midday Sand" for subtle contrast
  - Use for: Subtle backgrounds, borders

### Optional Gradient
- **Solar Flare Gradient**: `#FFB347 → #FFCE73`
  - For glows, hover states, soft lighting effects
  - Use for: Button hovers, ambient glows

## Critical Color Rules (WCAG AA Compliance)

### Text Colors
✅ **Light Mode:**
- Primary text: `#2E3440` (Dusk Slate) - BLACK
- Secondary text: `#2E3440` at 60% opacity
- Muted text: `#2E3440` at 40% opacity

✅ **Dark Mode:**
- Primary text: `#FFFFFF` (Solar White) - WHITE
- Secondary text: `#D8E3F0` (Sky Mist) at 60% opacity
- Muted text: `#D8E3F0` at 40% opacity

❌ **NEVER:**
- Orange/amber text (`#FFA845`) - fails WCAG AA
- Use Radiant Amber for text in any mode
- Use gradients for text

### Accent Usage
✅ **Radiant Amber (#FFA845) ONLY for:**
- Button backgrounds
- Focus rings/borders
- Hover states
- Glow effects in shadows
- Icons (sparingly)
- Highlights and badges

❌ **NEVER use Radiant Amber for:**
- Body text
- Headings
- Labels
- Any readable text content

## Tailwind CSS Configuration

```typescript
// tailwind.config.ts
colors: {
  // Light Mode
  "solar-white": "#FFFFFF",
  "radiant-amber": "#FFA845",
  "midday-sand": "#EADAC0",
  "dusk-slate": "#2E3440",
  "sky-mist": "#D8E3F0",

  // Dark Mode
  "eclipse-black": "#0F1114",
  "midnight-graphite": "#1C1F24",
  "lunar-sand": "#B7A98B",
}
```

## CSS Variables (globals.css)

```css
:root {
  /* Light Mode */
  --solar-white: #FFFFFF;
  --radiant-amber: #FFA845;
  --midday-sand: #EADAC0;
  --dusk-slate: #2E3440;
  --sky-mist: #D8E3F0;
  
  /* Gradients */
  --solar-gradient: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%);
}

.dark {
  /* Dark Mode */
  --eclipse-black: #0F1114;
  --midnight-graphite: #1C1F24;
  --solar-white: #FFFFFF;
  --sky-mist: #D8E3F0;
  --radiant-amber: #FFA845;
  --lunar-sand: #B7A98B;
  
  /* Gradients */
  --solar-flare: linear-gradient(135deg, #FFB347 0%, #FFCE73 100%);
}
```

## Usage Examples

### Backgrounds
```tsx
// Light mode main background
className="bg-solar-white"

// Dark mode main background
className="dark:bg-eclipse-black"

// Card/panel background (dark mode)
className="dark:bg-midnight-graphite"
```

### Text
```tsx
// Primary text (WCAG AA compliant)
className="text-dusk-slate dark:text-solar-white"

// Secondary text
className="text-dusk-slate/60 dark:text-sky-mist/60"

// Muted text
className="text-dusk-slate/40 dark:text-sky-mist/40"
```

### Accents
```tsx
// Button
className="bg-radiant-amber text-solar-white hover:bg-radiant-amber/90"

// Focus ring
className="focus:ring-radiant-amber/20 focus:border-radiant-amber"

// Link (use amber sparingly)
className="text-radiant-amber hover:underline"
```

### Borders
```tsx
// Subtle border
className="border-dusk-slate/10 dark:border-sky-mist/10"

// Accent border
className="border-radiant-amber/20"
```

## Color Contrast Ratios (WCAG AA)

### Light Mode
- Dusk Slate (#2E3440) on Solar White (#FFFFFF): **12.6:1** ✅ AAA
- Radiant Amber (#FFA845) on Solar White (#FFFFFF): **2.1:1** ❌ Fails AA (don't use for text)

### Dark Mode
- Solar White (#FFFFFF) on Eclipse Black (#0F1114): **19.8:1** ✅ AAA
- Radiant Amber (#FFA845) on Eclipse Black (#0F1114): **4.2:1** ❌ Fails AA (don't use for text)

## Design System Compliance Checklist

- [ ] All text uses Dusk Slate (light) or Solar White (dark)
- [ ] Radiant Amber only used for buttons, focus, glows
- [ ] NO orange/amber text anywhere
- [ ] All text meets WCAG AA contrast (4.5:1 minimum)
- [ ] Backgrounds use Solar White (light) or Eclipse Black (dark)
- [ ] Cards use glass effects with proper colors
- [ ] Focus states use Radiant Amber rings
- [ ] Hover states use Radiant Amber accents
