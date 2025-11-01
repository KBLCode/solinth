# Glassmorphic Navbar - Solinth Suite

## Overview

Beautiful glassmorphic navigation bar matching the login page button aesthetic, applied site-wide across all Solinth pages.

## Component Location

`src/components/navigation/header.tsx` (349 lines)

## Glass Effect Implementation

### Navbar Glass Style

```css
.glass-navbar-custom {
  background: linear-gradient(
    -75deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.05)
  ) !important;
  box-shadow:
    inset 0 0.125em 0.125em rgba(255, 168, 69, 0.05),
    inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.1),
    0 0.25em 0.125em -0.125em rgba(255, 168, 69, 0.2),
    0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.dark .glass-navbar-custom {
  background: linear-gradient(
    -75deg,
    rgba(28, 31, 36, 0.05),
    rgba(28, 31, 36, 0.2),
    rgba(28, 31, 36, 0.05)
  ) !important;
}
```

**Key Features:**

- Subtle directional gradient (-75deg angle)
- Radiant Amber glow in box-shadow
- 20px backdrop blur for true glass effect
- Matches login page button aesthetic perfectly
- Dark mode variant with Midnight Graphite tones

## Component Features

### 1. Framer Motion Animations

```tsx
// Entrance animation
<motion.nav
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
>
```

### 2. Active Section Highlighting

```tsx
// Active nav indicator with layoutId for smooth transitions
{
  isMounted && activeSection === item.label && (
    <motion.div
      layoutId="activeNav"
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 168, 69, 0.15) 0%, rgba(255, 168, 69, 0.08) 50%, rgba(255, 168, 69, 0.12) 100%)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 168, 69, 0.2)",
        boxShadow: "0 2px 8px rgba(255, 168, 69, 0.2)",
      }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
}
```

### 3. Mobile Menu

```tsx
// Full-screen glassmorphic slide-out menu
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  style={{
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
    backdropFilter: "blur(20px)",
    border: "2px solid rgba(0, 0, 0, 0.1)",
    borderTopColor: "rgba(255, 255, 255, 1)",
    borderLeftColor: "rgba(255, 255, 255, 0.8)",
    boxShadow: "inset 0 4px 8px rgba(255, 255, 255, 1), inset 0 -4px 8px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.15), 0 0 40px rgba(255, 168, 69, 0.25)",
  }}
>
```

### 4. Sign In Button

```tsx
// Glass button with wrapper pattern
<Link href="/login">
  <div className="glass-button-wrap">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-button rounded-full px-6 py-2 text-sm font-semibold"
    >
      <span className="glass-button-text">Sign In</span>
    </motion.button>
    <div className="glass-button-shadow rounded-full"></div>
  </div>
</Link>
```

## Navigation Items

```tsx
const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "#contact" },
];
```

## Smooth Scroll Implementation

```tsx
const handleNavClick = (label: string, href: string, e: React.MouseEvent) => {
  setActiveSection(label);
  setIsMobileMenuOpen(false);

  if (href.startsWith("#")) {
    e.preventDefault();

    // If not on homepage, navigate to homepage first
    if (window.location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
};
```

## Hydration Error Fixes

### 1. isMounted State

```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
  // Set initial active section based on pathname
  if (pathname === "/pricing") {
    setActiveSection("Pricing");
  } else if (pathname === "/docs") {
    setActiveSection("Docs");
  } else {
    setActiveSection("Features");
  }
}, [pathname]);
```

### 2. No Inline Style Tags

All CSS moved to `globals.css` to prevent hydration errors from inline `<style>` tags.

### 3. Logo Implementation

Using Logo component with `showText={false}` instead of inline SVG to avoid nested Link issues.

## Scrollbar Removal

```css
/* Hide scrollbar completely - AGGRESSIVE */
html {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

body {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar,
*::-webkit-scrollbar {
  display: none !important;
  width: 0px !important;
  height: 0px !important;
  background: transparent !important;
}
```

## Top Gap Fix

### Before:

```tsx
// Had py-5/py-3 padding creating gap
<div className="fixed left-0 right-0 top-0 z-[100] py-5">
```

### After:

```tsx
// No padding - sits flush at top
<div className="fixed left-0 right-0 top-0 z-[100] transition-all duration-300">
```

### Auth Layout Adjustment:

```tsx
// Added pt-20 to prevent navbar overlap
<div className="flex min-h-screen flex-col pt-20">
```

## Site-Wide Application

Navbar applied to all pages:

1. **Homepage** (`src/app/page.tsx`) - ✅
2. **Pricing** (`src/app/pricing/page.tsx`) - ✅
3. **Docs** (`src/app/docs/page.tsx`) - ✅
4. **About** (`src/app/about/page.tsx`) - ✅ Created
5. **Contact** (`src/app/contact/page.tsx`) - ✅ Created
6. **Terms** (`src/app/terms/page.tsx`) - ✅ Created
7. **Privacy** (`src/app/privacy/page.tsx`) - ✅ Created
8. **Auth Pages** (login, signup) - ✅ Via auth layout

## Responsive Design

### Desktop (1024px+)

- Full navigation menu visible
- Sign In button on right
- Active section highlighting
- Hover effects on all items

### Tablet (640px-1023px)

- Same as desktop
- Slightly reduced padding

### Mobile (<640px)

- Hamburger menu icon
- Full-screen slide-out menu
- Staggered entrance animations
- Glass effect on mobile menu
- Sign In button at bottom of menu

## Solinth Brand Compliance

- ✅ Glass effect matching login page buttons
- ✅ Radiant Amber (#FFA845) for active states and glows
- ✅ Black text (light mode) / White text (dark mode) - WCAG AA
- ✅ NO orange/amber text colors
- ✅ 20px backdrop blur for true glass effect
- ✅ Smooth Framer Motion animations
- ✅ NO visible scrollbar (clean minimal design)
- ✅ NO top gap (navbar flush with page top)

## Performance Considerations

- Framer Motion animations use GPU-accelerated transforms
- Backdrop-filter has good browser support (95%+)
- Active section detection uses efficient scroll event handling
- Mobile menu uses AnimatePresence for smooth mount/unmount

## Accessibility

- Semantic HTML with `<nav>` element
- Keyboard navigation support
- Focus states with Radiant Amber ring
- ARIA labels for mobile menu toggle
- High contrast text colors (WCAG AA)

## Future Enhancements

- Add search functionality
- Add user profile dropdown (when authenticated)
- Add notification bell (when authenticated)
- Add organization switcher in navbar (when authenticated)
- Add breadcrumbs for deep navigation
