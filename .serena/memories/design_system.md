# Solinth Suite - Design System & Brand

## Brand Colors

### Light Mode
- `--solar-white: #FFFFFF` - Clean base
- `--radiant-amber: #FFA845` - CTAs and highlights
- `--midday-sand: #EADAC0` - Warm support
- `--dusk-slate: #2E3440` - High contrast text
- `--sky-mist: #D8E3F0` - Balance warmth
- `--solar-gradient: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%)`

### Dark Mode
- `--eclipse-black: #0F1114` - Deep base
- `--midnight-graphite: #1C1F24` - Elevated panels
- `--solar-white: #FFFFFF` - High contrast text
- `--sky-mist: #D8E3F0` - Muted elements
- `--radiant-amber: #FFA845` - Consistent brand accent
- `--lunar-sand: #B7A98B` - Subtle contrast
- `--solar-flare: linear-gradient(135deg, #FFB347 0%, #FFCE73 100%)`

## Glassmorphic Design System

### Light Mode Glass
```css
.glass-card {
  background: linear-gradient(
    135deg, 
    rgba(255,255,255,0.98) 0%, 
    rgba(255,255,255,0.92) 50%, 
    rgba(255,255,255,0.95) 100%
  );
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,165,69,0.15);
  box-shadow: 
    inset 0 1px 2px rgba(255,255,255,1),
    0 8px 32px rgba(255,165,69,0.12),
    0 2px 8px rgba(0,0,0,0.08);
}
```

### Dark Mode Glass
```css
.dark .glass-card {
  background: linear-gradient(
    135deg,
    rgba(28,31,36,0.95) 0%,
    rgba(28,31,36,0.88) 50%,
    rgba(28,31,36,0.92) 100%
  );
  border: 1.5px solid rgba(255,165,69,0.25);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 12px 40px rgba(255,165,69,0.15),
    0 4px 12px rgba(0,0,0,0.4);
}
```

## Component Patterns
- Use Radix UI primitives as base
- Apply glassmorphic styling with Solinth colors
- Ensure accessibility compliance
- Responsive design with mobile-first approach