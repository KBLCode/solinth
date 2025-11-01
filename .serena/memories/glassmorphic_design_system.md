# Solinth Glassmorphic Design System

## CORRECTED Glass Specifications (Enhanced Frost)

### Light Mode Glass Card
```css
.glass-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,      /* Full opacity - enhanced frost */
    rgba(255, 255, 255, 0.95) 50%,
    rgba(255, 255, 255, 0.98) 100%
  );
  backdrop-filter: blur(24px);       /* Increased frost */
  -webkit-backdrop-filter: blur(24px);
  border: 2px solid rgba(0, 0, 0, 0.15);  /* Darker border */
  border-top-color: rgba(255, 255, 255, 1);  /* Light from top-left */
  border-left-color: rgba(255, 255, 255, 1); /* Creates depth */
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 1),    /* Top highlight */
    inset 0 -1px 2px rgba(0, 0, 0, 0.05),      /* Bottom shadow */
    0 8px 32px rgba(255, 165, 69, 0.12),       /* Amber glow */
    0 2px 8px rgba(0, 0, 0, 0.08);             /* Depth shadow */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 1),
    inset 0 -1px 2px rgba(0, 0, 0, 0.05),
    0 12px 40px rgba(255, 165, 69, 0.18),      /* Stronger amber glow */
    0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Dark Mode Glass Card
```css
.dark .glass-card {
  background: linear-gradient(
    135deg,
    rgba(28, 31, 36, 1) 0%,         /* Full opacity - enhanced frost */
    rgba(28, 31, 36, 0.95) 50%,
    rgba(28, 31, 36, 0.98) 100%
  );
  backdrop-filter: blur(28px);      /* Even more frost in dark mode */
  -webkit-backdrop-filter: blur(28px);
  border: 2px solid rgba(255, 165, 69, 0.2);  /* Amber border */
  border-top-color: rgba(255, 255, 255, 0.15); /* Light from top-left */
  border-left-color: rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),    /* Top highlight */
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),         /* Bottom shadow */
    0 12px 40px rgba(255, 165, 69, 0.15),      /* Amber glow */
    0 4px 12px rgba(0, 0, 0, 0.4);             /* Depth shadow */
}

.dark .glass-card:hover {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 16px 48px rgba(255, 165, 69, 0.2),       /* Stronger glow */
    0 6px 16px rgba(0, 0, 0, 0.5);
}
```

### Glass Button (Solinth Brand)
```css
.glass-button {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(255, 165, 69, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.15);
}

.glass-button:hover {
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(0, 0, 0, 0.1),
    0 6px 24px rgba(255, 165, 69, 0.35),
    0 3px 12px rgba(0, 0, 0, 0.2);
}

.glass-button:active {
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(255, 165, 69, 0.2);
}
```

### Glass Input Fields
```css
.glass-input {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: rgba(255, 255, 255, 0.8);
  border-left-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.8),
    0 2px 8px rgba(0, 0, 0, 0.05);
}

.glass-input:focus {
  outline: none;
  border-color: rgba(255, 168, 69, 0.5);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.8),
    0 0 0 3px rgba(255, 168, 69, 0.1),
    0 2px 8px rgba(255, 168, 69, 0.15);
}

.dark .glass-input {
  background: linear-gradient(
    135deg,
    rgba(28, 31, 36, 0.9) 0%,
    rgba(28, 31, 36, 0.7) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 165, 69, 0.15);
  border-top-color: rgba(255, 255, 255, 0.1);
  border-left-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .glass-input:focus {
  border-color: rgba(255, 168, 69, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 3px rgba(255, 168, 69, 0.15),
    0 2px 8px rgba(255, 168, 69, 0.2);
}
```

## Solinth Brand Colors

### Light Mode
- **Solar White:** `#FFFFFF` - Clean base
- **Radiant Amber:** `#FFA845` - CTAs and highlights
- **Midday Sand:** `#EADAC0` - Warm support
- **Dusk Slate:** `#2E3440` - High contrast text
- **Sky Mist:** `#D8E3F0` - Balance warmth
- **Solar Gradient:** `linear-gradient(135deg, #FFA845 0%, #FFD67C 100%)`

### Dark Mode
- **Eclipse Black:** `#0F1114` - Deep base
- **Midnight Graphite:** `#1C1F24` - Elevated panels
- **Solar White:** `#FFFFFF` - High contrast text
- **Sky Mist:** `#D8E3F0` - Muted elements
- **Radiant Amber:** `#FFA845` - Consistent brand accent
- **Lunar Sand:** `#B7A98B` - Subtle contrast
- **Solar Flare:** `linear-gradient(135deg, #FFB347 0%, #FFCE73 100%)`

## Glass Variants

### Elevated Glass
```css
.glass-elevated {
  transform: translateY(-4px);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 1),
    inset 0 -1px 2px rgba(0, 0, 0, 0.05),
    0 16px 48px rgba(255, 165, 69, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.12);
}

.dark .glass-elevated {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 20px 56px rgba(255, 165, 69, 0.25),
    0 8px 20px rgba(0, 0, 0, 0.5);
}
```

### Interactive Glass
```css
.glass-interactive {
  cursor: pointer;
}

.glass-interactive:active {
  transform: translateY(0);
}
```

### Glowing Glass
```css
.glass-glow {
  animation: glassGlow 2s ease-in-out infinite alternate;
}

@keyframes glassGlow {
  0% {
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 1),
      inset 0 -1px 2px rgba(0, 0, 0, 0.05),
      0 8px 32px rgba(255, 165, 69, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.08);
  }
  100% {
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 1),
      inset 0 -1px 2px rgba(0, 0, 0, 0.05),
      0 12px 40px rgba(255, 165, 69, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.12);
  }
}
```

## Button Component Usage

```tsx
import { Button } from "@/components/ui/button";

// Primary glassmorphic button with Radiant Amber gradient
<Button variant="default">Click Me</Button>

// Outline glassmorphic button
<Button variant="outline">Outline</Button>

// Secondary glassmorphic button
<Button variant="secondary">Secondary</Button>

// Destructive glassmorphic button
<Button variant="destructive">Delete</Button>

// Ghost button
<Button variant="ghost">Ghost</Button>

// Link button
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔥</Button>
```

## Quality Checklist

When implementing glassmorphic components, verify:

- ✅ Enhanced frost (24px/28px blur)
- ✅ Full opacity gradient base (1 → 0.95 → 0.98)
- ✅ Directional borders (top/left lighter for light source)
- ✅ Dual inset shadows (top highlight + bottom shadow)
- ✅ Amber glow in all box-shadows
- ✅ 2px borders for better definition
- ✅ Smooth cubic-bezier transitions
- ✅ Proper hover states with elevation
- ✅ Active states with reduced elevation
- ✅ Light and dark mode variants
- ✅ Solinth brand colors applied
- ✅ Accessible contrast ratios (WCAG 2.1 AA)
