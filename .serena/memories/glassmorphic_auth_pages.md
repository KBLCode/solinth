# Glassmorphic Authentication Pages

## Pattern Applied to Login Page (2025-11-01)

### Implementation
- Wrapped entire login form in `.glass-card` div
- Applied `rounded-2xl p-8` for proper styling
- Changed max-width from `max-w-xs` to `max-w-md` for better proportions
- Added `p-4` to outer container for mobile spacing

### Glass Card Properties
- 20px backdrop blur for true glass effect
- Directional borders (top/left lighter for light source)
- Dual inset shadows (top highlight + bottom shadow)
- Radiant Amber glow in box-shadow
- Hover state increases elevation smoothly

### Text Colors (WCAG AA Compliant)
- ✅ Black text in light mode (`text-dusk-slate`)
- ✅ White text in dark mode (`text-solar-white`)
- ❌ NO orange/amber text colors
- ✅ Radiant Amber only in buttons and shadows

### Code Pattern
```tsx
<div className="flex min-h-screen items-center justify-center bg-solar-white dark:bg-eclipse-black p-4">
  <div className="glass-card mx-auto w-full max-w-md rounded-2xl p-8 space-y-6">
    {/* Form content */}
  </div>
</div>
```

### Next Auth Pages to Apply
- Signup page (`src/app/(auth)/signup/page.tsx`)
- Password reset pages
- Email verification page
- MFA setup component

### Success Criteria
- ✅ Glass card wrapper applied
- ✅ 20px backdrop blur visible
- ✅ Directional borders create depth
- ✅ Dual inset shadows visible
- ✅ Radiant Amber glow in shadows
- ✅ Text colors WCAG AA compliant
- ✅ Responsive design maintained
- ✅ All form functionality preserved
