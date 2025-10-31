# SOLINTH FRONTEND GRAPHICAL ELEMENTS - COMPREHENSIVE LIST

**Date:** 2025-10-31
**Purpose:** Complete inventory of all visual elements needed for Solinth Suite
**Status:** Pre-Implementation Planning

---

## 📋 DOCUMENTATION SOURCES

- **PRD.md:** Lines 1-516 (All features and design requirements)
- **SDD.md:** Lines 1-1367 (Technical implementation and UI components)
- **PLAN.md:** Lines 1-936 (Implementation roadmap)
- **BUILT.md:** Lines 1-256 (Current progress)

---

## 🎨 BRAND IDENTITY ELEMENTS

### Logo & Brand Assets

#### Primary Logo

- **Solinth Logo** (Main brand mark)
  - Format: SVG, PNG (transparent)
  - Sizes: 32x32, 64x64, 128x128, 256x256, 512x512
  - Variants: Full color, white, black, amber
  - Usage: Header, favicon, emails, marketing

#### Logo Variations

- **Solinth Icon** (Symbol only, no text)
  - Format: SVG, PNG
  - Sizes: 16x16, 24x24, 32x32, 48x48
  - Usage: Favicon, mobile, small spaces

- **Solinth Wordmark** (Text only)
  - Format: SVG, PNG
  - Sizes: Variable width, 32px height, 48px height
  - Usage: Headers, footers, emails

#### Brand Patterns

- **Solar Gradient Pattern** (Background texture)
  - Format: SVG, PNG (repeatable)
  - Size: 1920x1080 (hero), 512x512 (tile)
  - Usage: Hero sections, email headers

- **Glassmorphic Texture** (Subtle noise overlay)
  - Format: PNG (transparent)
  - Size: 512x512 (tile)
  - Opacity: 5-10%
  - Usage: Glass card overlays

---

## 🔐 AUTHENTICATION UI ELEMENTS

### Login Page (`/app/(auth)/login/page.tsx`)

#### Hero Section

- **Login Hero Background**
  - Type: Gradient with glassmorphic overlay
  - Size: Full viewport (1920x1080 reference)
  - Colors: Solar White → Radiant Amber gradient
  - Animation: Subtle floating particles

#### Login Form Card

- **Glassmorphic Card Background**
  - Type: Glass effect with amber glow
  - Size: 480px width, auto height
  - Border: 1.5px Radiant Amber (15% opacity)
  - Shadow: Amber glow (12% opacity)

#### Form Elements

- **Email Input Icon**
  - Type: SVG icon
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Email field prefix

- **Password Input Icon**
  - Type: SVG icon
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Password field prefix

- **Eye Icon** (Show/hide password)
  - Type: SVG icon
  - Size: 20x20
  - States: Open eye, closed eye
  - Color: Dusk Slate / Solar White

#### Social OAuth Buttons

- **GitHub Logo**
  - Type: SVG icon
  - Size: 24x24
  - Color: White (on dark button)
  - Usage: GitHub OAuth button

- **Google Logo**
  - Type: SVG icon
  - Size: 24x24
  - Color: Full color (official Google colors)
  - Usage: Google OAuth button

#### Loading States

- **Login Spinner**
  - Type: Animated SVG
  - Size: 24x24
  - Color: Radiant Amber
  - Animation: Smooth rotation

### Signup Page (`/app/(auth)/signup/page.tsx`)

#### Multi-Step Progress Indicator

- **Step Indicator Dots**
  - Type: SVG circles
  - Size: 12x12 each
  - States: Active (filled), inactive (outline), complete (checkmark)
  - Colors: Radiant Amber (active), Sky Mist (inactive)

#### Organization Creation

- **Organization Icon**
  - Type: SVG icon
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Organization setup step

- **Team Icon**
  - Type: SVG icon
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Team invitation step

### Email Verification Page

#### Email Sent Illustration

- **Email Envelope Illustration**
  - Type: SVG illustration
  - Size: 256x256
  - Style: Glassmorphic with amber accents
  - Animation: Subtle floating

- **Checkmark Icon** (Verification success)
  - Type: SVG icon
  - Size: 64x64
  - Color: Green (success)
  - Animation: Scale in with bounce

### MFA Setup Component

#### QR Code Display

- **QR Code Container**
  - Type: Generated QR code
  - Size: 256x256
  - Background: White
  - Border: Glassmorphic card

#### Backup Codes Display

- **Copy Icon**
  - Type: SVG icon
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Copy backup codes button

- **Download Icon**
  - Type: SVG icon
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Download backup codes button

### Organization Switcher

#### Dropdown Component

- **Organization Avatar Placeholder**
  - Type: SVG icon or generated avatar
  - Size: 32x32
  - Colors: Gradient based on org name
  - Usage: Organization identifier

- **Chevron Down Icon**
  - Type: SVG icon
  - Size: 16x16
  - Color: Dusk Slate / Solar White
  - Animation: Rotate on open

- **Plus Icon** (Create new organization)
  - Type: SVG icon
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Add organization button

---

## 📊 DASHBOARD UI ELEMENTS

### Dashboard Shell (`/app/(dashboard)/layout.tsx`)

#### Sidebar Navigation

- **Dashboard Icon**
  - Type: SVG icon
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Main dashboard nav item

- **Business Suite Icon**
  - Type: SVG icon (chart/graph)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Business Suite nav item

- **Creative Suite Icon**
  - Type: SVG icon (palette/brush)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Creative Suite nav item

- **Directors Suite Icon**
  - Type: SVG icon (briefcase)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Directors Suite nav item

- **Brand Suite Icon**
  - Type: SVG icon (star/badge)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Brand Suite nav item

- **Reporting Suite Icon**
  - Type: SVG icon (document/report)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Reporting Suite nav item

- **Support Suite Icon**
  - Type: SVG icon (headset/chat)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Support Suite nav item

- **Security Suite Icon**
  - Type: SVG icon (shield/lock)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Security Suite nav item

- **Custom Dashboards Icon**
  - Type: SVG icon (grid/layout)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Custom Dashboards nav item

#### Header Elements

- **Search Icon**
  - Type: SVG icon
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Global search button

- **Notification Bell Icon**
  - Type: SVG icon
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Badge: Red dot for unread
  - Usage: Notifications dropdown

- **Settings Icon**
  - Type: SVG icon (gear)
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Settings menu

- **User Avatar Placeholder**
  - Type: SVG icon or generated avatar
  - Size: 32x32
  - Colors: Gradient based on user name
  - Usage: User menu dropdown

#### Theme Toggle

- **Sun Icon** (Light mode)
  - Type: SVG icon
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Switch to light mode

- **Moon Icon** (Dark mode)
  - Type: SVG icon
  - Size: 20x20
  - Color: Sky Mist
  - Usage: Switch to dark mode

### Widget Components

#### Metric Card

- **Trend Up Icon**
  - Type: SVG icon (arrow up)
  - Size: 16x16
  - Color: Green (positive)
  - Usage: Positive metric change

- **Trend Down Icon**
  - Type: SVG icon (arrow down)
  - Size: 16x16
  - Color: Red (negative)
  - Usage: Negative metric change

- **Trend Neutral Icon**
  - Type: SVG icon (arrow right)
  - Size: 16x16
  - Color: Sky Mist (neutral)
  - Usage: No change

#### Chart Components

- **Line Chart Placeholder**
  - Type: SVG illustration
  - Size: Variable (responsive)
  - Style: Glassmorphic with amber accents
  - Usage: Empty state for line charts

- **Bar Chart Placeholder**
  - Type: SVG illustration
  - Size: Variable (responsive)
  - Style: Glassmorphic with amber accents
  - Usage: Empty state for bar charts

- **Pie Chart Placeholder**
  - Type: SVG illustration
  - Size: Variable (responsive)
  - Style: Glassmorphic with amber accents
  - Usage: Empty state for pie charts

#### Widget Controls

- **Drag Handle Icon**
  - Type: SVG icon (grip dots)
  - Size: 16x16
  - Color: Sky Mist
  - Usage: Drag to reorder widgets

- **Resize Handle Icon**
  - Type: SVG icon (corner arrows)
  - Size: 16x16
  - Color: Sky Mist
  - Usage: Resize widget

- **More Options Icon**
  - Type: SVG icon (three dots)
  - Size: 16x16
  - Color: Dusk Slate / Solar White
  - Usage: Widget settings menu

- **Refresh Icon**
  - Type: SVG icon (circular arrow)
  - Size: 16x16
  - Color: Dusk Slate / Solar White
  - Animation: Spin on refresh
  - Usage: Refresh widget data

- **Fullscreen Icon**
  - Type: SVG icon (expand arrows)
  - Size: 16x16
  - Color: Dusk Slate / Solar White
  - Usage: Expand widget to fullscreen

- **Close Icon**
  - Type: SVG icon (X)
  - Size: 16x16
  - Color: Dusk Slate / Solar White
  - Usage: Remove widget

---

## 🤖 AI ASSISTANT (SOL) ELEMENTS

### Ask Sol Button

- **Sol AI Icon**
  - Type: SVG icon (sparkle/star)
  - Size: 24x24
  - Color: Radiant Amber
  - Animation: Subtle pulse
  - Usage: Global "Ask Sol" button

- **Sol Avatar**
  - Type: SVG illustration or 3D render
  - Size: 48x48 (small), 128x128 (large)
  - Style: Friendly AI character with amber glow
  - Usage: Chat interface, loading states

### Chat Interface

- **Chat Bubble (User)**
  - Type: Glassmorphic container
  - Style: Right-aligned, Sky Mist background
  - Size: Variable width, auto height

- **Chat Bubble (Sol)**
  - Type: Glassmorphic container
  - Style: Left-aligned, Radiant Amber accent
  - Size: Variable width, auto height

- **Typing Indicator**
  - Type: Animated SVG (three dots)
  - Size: 48x16
  - Color: Radiant Amber
  - Animation: Bounce sequence
  - Usage: Sol is typing

- **Send Icon**
  - Type: SVG icon (paper plane)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Send message button

### Insight Panels

- **Lightbulb Icon** (Insight)
  - Type: SVG icon
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: AI-generated insights

- **Warning Icon** (Alert)
  - Type: SVG icon
  - Size: 24x24
  - Color: Orange/Red
  - Usage: Important alerts

- **Info Icon** (Information)
  - Type: SVG icon
  - Size: 24x24
  - Color: Sky Mist
  - Usage: General information

---

## 📈 BUSINESS SUITE ELEMENTS

### Integration Hub

- **Stripe Logo**
  - Type: SVG logo
  - Size: 48x48
  - Color: Official Stripe purple
  - Usage: Stripe integration card

- **QuickBooks Logo**
  - Type: SVG logo
  - Size: 48x48
  - Color: Official QuickBooks green
  - Usage: QuickBooks integration card

- **Google Analytics Logo**
  - Type: SVG logo
  - Size: 48x48
  - Color: Official Google colors
  - Usage: Google Analytics integration card

- **Connected Icon** (Integration status)
  - Type: SVG icon (checkmark in circle)
  - Size: 20x20
  - Color: Green
  - Usage: Connected integration indicator

- **Disconnected Icon** (Integration status)
  - Type: SVG icon (X in circle)
  - Size: 20x20
  - Color: Red
  - Usage: Disconnected integration indicator

- **Syncing Icon** (Integration status)
  - Type: Animated SVG (circular arrows)
  - Size: 20x20
  - Color: Radiant Amber
  - Animation: Rotation
  - Usage: Syncing integration indicator

### Correlation Viewer

- **Correlation Scatter Plot**
  - Type: Interactive chart
  - Size: Variable (responsive)
  - Style: Glassmorphic with amber data points
  - Usage: Visualize metric correlations

- **Link Icon** (Correlation)
  - Type: SVG icon (chain link)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Correlation indicator

---

## 🎨 CREATIVE SUITE ELEMENTS

### Content Generation

- **Blog Icon**
  - Type: SVG icon (document with text)
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Blog post generator

- **Email Icon**
  - Type: SVG icon (envelope)
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Email generator

- **Social Media Icon**
  - Type: SVG icon (share/network)
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Social media caption generator

### Social Media Scheduler

- **Calendar Icon**
  - Type: SVG icon
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Scheduler calendar view

- **Facebook Logo**
  - Type: SVG logo
  - Size: 24x24
  - Color: Official Facebook blue
  - Usage: Facebook post indicator

- **Twitter/X Logo**
  - Type: SVG logo
  - Size: 24x24
  - Color: Official Twitter/X black
  - Usage: Twitter/X post indicator

- **LinkedIn Logo**
  - Type: SVG logo
  - Size: 24x24
  - Color: Official LinkedIn blue
  - Usage: LinkedIn post indicator

- **Instagram Logo**
  - Type: SVG logo
  - Size: 24x24
  - Color: Official Instagram gradient
  - Usage: Instagram post indicator

### Image Generation

- **Image Placeholder**
  - Type: SVG illustration
  - Size: Variable (responsive)
  - Style: Glassmorphic with amber border
  - Usage: Empty state for image generation

- **DALL-E Logo**
  - Type: SVG logo
  - Size: 32x32
  - Color: Official OpenAI colors
  - Usage: DALL-E provider option

- **Stable Diffusion Logo**
  - Type: SVG logo
  - Size: 32x32
  - Color: Official Stability AI colors
  - Usage: Stable Diffusion provider option

---

## 💼 DIRECTORS SUITE ELEMENTS

### Scenario Planning

- **Slider Icon**
  - Type: SVG icon (horizontal slider)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Interactive scenario sliders

- **Best Case Icon**
  - Type: SVG icon (arrow up with star)
  - Size: 24x24
  - Color: Green
  - Usage: Best case scenario indicator

- **Worst Case Icon**
  - Type: SVG icon (arrow down with warning)
  - Size: 24x24
  - Color: Red
  - Usage: Worst case scenario indicator

- **Likely Case Icon**
  - Type: SVG icon (target/bullseye)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Likely case scenario indicator

### Board Management

- **Meeting Icon**
  - Type: SVG icon (calendar with people)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Board meeting indicator

- **Vote Icon**
  - Type: SVG icon (checkmark in box)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Voting system

- **Action Item Icon**
  - Type: SVG icon (clipboard with checkmark)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Action item tracker

---

## 📄 REPORTING SUITE ELEMENTS

### Report Generation

- **PDF Icon**
  - Type: SVG icon (document with PDF label)
  - Size: 48x48
  - Color: Red (PDF standard)
  - Usage: PDF report indicator

- **Export Icon**
  - Type: SVG icon (download arrow)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Export report button

- **Schedule Icon**
  - Type: SVG icon (clock with calendar)
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Schedule report delivery

### Collaborative Annotations

- **Comment Icon**
  - Type: SVG icon (speech bubble)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Add comment button

- **Mention Icon** (@)
  - Type: SVG icon (@ symbol)
  - Size: 16x16
  - Color: Radiant Amber
  - Usage: Mention user in comment

- **Reply Icon**
  - Type: SVG icon (curved arrow)
  - Size: 16x16
  - Color: Dusk Slate / Solar White
  - Usage: Reply to comment

---

## 🎯 SUPPORT SUITE ELEMENTS

### Support Integration

- **Crisp Logo**
  - Type: SVG logo
  - Size: 48x48
  - Color: Official Crisp blue
  - Usage: Crisp integration card

- **Ticket Icon**
  - Type: SVG icon (ticket/tag)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Support ticket indicator

- **Response Time Icon**
  - Type: SVG icon (clock)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Response time metric

### CSAT/NPS System

- **Happy Face Icon** (CSAT)
  - Type: SVG icon (smiling face)
  - Size: 32x32
  - Color: Green
  - Usage: Positive satisfaction

- **Neutral Face Icon** (CSAT)
  - Type: SVG icon (neutral face)
  - Size: 32x32
  - Color: Sky Mist
  - Usage: Neutral satisfaction

- **Sad Face Icon** (CSAT)
  - Type: SVG icon (sad face)
  - Size: 32x32
  - Color: Red
  - Usage: Negative satisfaction

---

## 🔒 SECURITY SUITE ELEMENTS

### Risk Management

- **Risk Dashboard Icon**
  - Type: SVG icon (gauge/meter)
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Risk dashboard indicator

- **Alert Icon**
  - Type: SVG icon (bell with exclamation)
  - Size: 24x24
  - Color: Red/Orange
  - Animation: Shake on new alert
  - Usage: Risk alert indicator

### Compliance Tracking

- **Compliance Icon**
  - Type: SVG icon (shield with checkmark)
  - Size: 48x48
  - Color: Green
  - Usage: Compliance status

- **Deadline Icon**
  - Type: SVG icon (calendar with clock)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Compliance deadline

---

## 🎨 BRAND SUITE ELEMENTS

### Digital Asset Management

- **Folder Icon**
  - Type: SVG icon
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Asset folder

- **File Icon**
  - Type: SVG icon (document)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Generic file

- **Image File Icon**
  - Type: SVG icon (image/photo)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Image file

- **Video File Icon**
  - Type: SVG icon (play button)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Usage: Video file

- **Version Icon**
  - Type: SVG icon (clock with arrow)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Version history

- **Approval Icon**
  - Type: SVG icon (checkmark in circle)
  - Size: 20x20
  - Color: Green
  - Usage: Approved asset

- **Pending Icon**
  - Type: SVG icon (clock)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Pending approval

---

## 🛠️ CUSTOM DASHBOARDS ELEMENTS

### API Sandbox

- **API Icon**
  - Type: SVG icon (code brackets)
  - Size: 48x48
  - Color: Radiant Amber
  - Usage: Custom API indicator

- **Lock Icon** (Security)
  - Type: SVG icon (padlock)
  - Size: 20x20
  - Color: Green (secure)
  - Usage: HTTPS indicator

- **Rate Limit Icon**
  - Type: SVG icon (speedometer)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Rate limit indicator

### Data Transformation

- **Transform Icon**
  - Type: SVG icon (arrows in circle)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Data transformation

- **Mapping Icon**
  - Type: SVG icon (connected nodes)
  - Size: 24x24
  - Color: Radiant Amber
  - Usage: Data mapping

---

## 📧 EMAIL TEMPLATES

### Transactional Emails

#### Email Header

- **Email Header Banner**
  - Type: PNG/JPG image
  - Size: 600x200
  - Style: Solar Gradient with Solinth logo
  - Usage: All transactional emails

#### Email Verification

- **Verification Button Background**
  - Type: Gradient
  - Size: 200x48
  - Colors: Radiant Amber gradient
  - Usage: Verify email button

#### Organization Invitation

- **Invitation Card Background**
  - Type: Glassmorphic design
  - Size: 600x300
  - Style: Solar White with amber accents
  - Usage: Invitation email card

#### Password Reset

- **Reset Button Background**
  - Type: Gradient
  - Size: 200x48
  - Colors: Radiant Amber gradient
  - Usage: Reset password button

---

## 🎭 EMPTY STATES & PLACEHOLDERS

### Dashboard Empty States

- **No Data Illustration**
  - Type: SVG illustration
  - Size: 256x256
  - Style: Glassmorphic with amber accents
  - Usage: Empty dashboard state

- **No Integrations Illustration**
  - Type: SVG illustration
  - Size: 256x256
  - Style: Glassmorphic with amber accents
  - Usage: No integrations connected

- **No Reports Illustration**
  - Type: SVG illustration
  - Size: 256x256
  - Style: Glassmorphic with amber accents
  - Usage: No reports generated

### Loading States

- **Skeleton Card**
  - Type: Animated gradient
  - Size: Variable (matches content)
  - Colors: Sky Mist with shimmer
  - Animation: Left-to-right shimmer
  - Usage: Loading content placeholder

- **Spinner (Large)**
  - Type: Animated SVG
  - Size: 48x48
  - Color: Radiant Amber
  - Animation: Smooth rotation
  - Usage: Page loading

- **Spinner (Small)**
  - Type: Animated SVG
  - Size: 24x24
  - Color: Radiant Amber
  - Animation: Smooth rotation
  - Usage: Button loading

### Error States

- **Error Illustration**
  - Type: SVG illustration
  - Size: 256x256
  - Style: Glassmorphic with red accents
  - Usage: Error page

- **404 Illustration**
  - Type: SVG illustration
  - Size: 512x512
  - Style: Glassmorphic with amber accents
  - Usage: 404 page not found

---

## 🎨 UI COMPONENT ELEMENTS

### Buttons

- **Primary Button Background**
  - Type: Gradient
  - Colors: Radiant Amber gradient
  - States: Default, hover, active, disabled
  - Usage: Primary actions

- **Secondary Button Background**
  - Type: Glassmorphic
  - Colors: Sky Mist with border
  - States: Default, hover, active, disabled
  - Usage: Secondary actions

### Form Elements

- **Input Field Background**
  - Type: Glassmorphic
  - Colors: Solar White / Midnight Graphite
  - States: Default, focus, error, disabled
  - Usage: All text inputs

- **Checkbox (Unchecked)**
  - Type: SVG icon (empty box)
  - Size: 20x20
  - Color: Sky Mist border
  - Usage: Checkbox input

- **Checkbox (Checked)**
  - Type: SVG icon (box with checkmark)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Checked checkbox

- **Radio (Unchecked)**
  - Type: SVG icon (empty circle)
  - Size: 20x20
  - Color: Sky Mist border
  - Usage: Radio input

- **Radio (Checked)**
  - Type: SVG icon (filled circle)
  - Size: 20x20
  - Color: Radiant Amber
  - Usage: Checked radio

### Modals & Dialogs

- **Modal Backdrop**
  - Type: Semi-transparent overlay
  - Color: Eclipse Black (60% opacity)
  - Usage: Modal background

- **Modal Container**
  - Type: Glassmorphic card
  - Size: Variable (responsive)
  - Style: Solar White / Midnight Graphite with amber glow
  - Usage: Modal content

### Tooltips

- **Tooltip Background**
  - Type: Glassmorphic
  - Size: Variable (auto-fit content)
  - Colors: Midnight Graphite / Solar White
  - Usage: Hover tooltips

- **Tooltip Arrow**
  - Type: SVG triangle
  - Size: 8x8
  - Color: Matches tooltip background
  - Usage: Tooltip pointer

---

## 📱 RESPONSIVE ELEMENTS

### Mobile Navigation

- **Hamburger Menu Icon**
  - Type: SVG icon (three lines)
  - Size: 24x24
  - Color: Dusk Slate / Solar White
  - Animation: Transform to X on open
  - Usage: Mobile menu toggle

- **Mobile Menu Background**
  - Type: Glassmorphic overlay
  - Size: Full screen
  - Style: Midnight Graphite / Solar White
  - Animation: Slide in from left
  - Usage: Mobile navigation menu

### Tablet Layouts

- **Tablet Grid Background**
  - Type: Glassmorphic cards
  - Size: 2-column grid
  - Usage: Tablet dashboard layout

---

## 🎬 ANIMATIONS & TRANSITIONS

### Micro-Interactions

- **Button Hover Glow**
  - Type: Box shadow animation
  - Color: Radiant Amber (18% opacity)
  - Duration: 300ms
  - Easing: Cubic bezier (0.4, 0, 0.2, 1)

- **Card Hover Lift**
  - Type: Transform translateY
  - Distance: -2px
  - Duration: 300ms
  - Easing: Cubic bezier (0.4, 0, 0.2, 1)

### Page Transitions

- **Fade In**
  - Type: Opacity animation
  - Duration: 400ms
  - Easing: Ease-in-out
  - Usage: Page load

- **Slide In**
  - Type: Transform translateX
  - Distance: 20px
  - Duration: 400ms
  - Easing: Cubic bezier (0.4, 0, 0.2, 1)
  - Usage: Modal open

---

## 📊 CHART & VISUALIZATION ELEMENTS

### Chart Components

- **Line Chart Grid**
  - Type: SVG lines
  - Color: Sky Mist (10% opacity)
  - Usage: Chart background grid

- **Bar Chart Bars**
  - Type: SVG rectangles
  - Colors: Radiant Amber gradient
  - Usage: Bar chart data

- **Pie Chart Segments**
  - Type: SVG paths
  - Colors: Radiant Amber, Sky Mist, Midday Sand (variations)
  - Usage: Pie chart data

### Chart Controls

- **Zoom In Icon**
  - Type: SVG icon (magnifying glass with +)
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Chart zoom in

- **Zoom Out Icon**
  - Type: SVG icon (magnifying glass with -)
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Chart zoom out

- **Reset Zoom Icon**
  - Type: SVG icon (magnifying glass with arrows)
  - Size: 20x20
  - Color: Dusk Slate / Solar White
  - Usage: Reset chart zoom

---

## 🎨 DESIGN SYSTEM TOKENS

### Color Swatches (For Design Reference)

- **Solar White Swatch** (#FFFFFF)
- **Radiant Amber Swatch** (#FFA845)
- **Midday Sand Swatch** (#EADAC0)
- **Dusk Slate Swatch** (#2E3440)
- **Sky Mist Swatch** (#D8E3F0)
- **Eclipse Black Swatch** (#0F1114)
- **Midnight Graphite Swatch** (#1C1F24)
- **Lunar Sand Swatch** (#B7A98B)

### Gradient Swatches

- **Solar Gradient** (#FFA845 → #FFD67C)
- **Solar Flare** (#FFB347 → #FFCE73)

---

## 📦 ASSET DELIVERY REQUIREMENTS

### File Formats

- **SVG:** All icons, logos, illustrations (vector)
- **PNG:** Raster images, email headers (transparent backgrounds)
- **JPG:** Photos, large images (optimized)
- **WebP:** Modern format for web (fallback to PNG/JPG)

### Optimization

- **SVG:** Minified, optimized paths
- **PNG:** Compressed with TinyPNG or similar
- **JPG:** 80-90% quality, progressive
- **WebP:** 80% quality with PNG/JPG fallback

### Naming Convention

```
solinth-[element]-[variant]-[size].[format]

Examples:
- solinth-logo-full-color-256.svg
- solinth-icon-dashboard-24.svg
- solinth-illustration-empty-state-256.svg
- solinth-email-header-600x200.png
```

### Organization Structure

```
/public/
├── images/
│   ├── logos/
│   │   ├── solinth-logo-full-color.svg
│   │   ├── solinth-logo-white.svg
│   │   ├── solinth-icon-32.svg
│   │   └── solinth-wordmark.svg
│   ├── icons/
│   │   ├── dashboard/
│   │   ├── auth/
│   │   ├── suites/
│   │   └── ui/
│   ├── illustrations/
│   │   ├── empty-states/
│   │   ├── errors/
│   │   └── onboarding/
│   ├── email/
│   │   ├── headers/
│   │   └── templates/
│   └── patterns/
│       ├── solar-gradient.svg
│       └── glassmorphic-texture.png
```

---

## 🎯 PRIORITY LEVELS

### P0 - Critical (Needed Immediately)

- Solinth logo and icon
- Authentication UI elements (login, signup)
- Dashboard navigation icons (8 suites)
- Basic UI components (buttons, inputs, cards)
- Loading states (spinners, skeletons)
- Email header banner

### P1 - High Priority (Needed Soon)

- Chart components (line, bar, pie)
- Widget controls (drag, resize, more)
- AI assistant (Sol) elements
- Integration logos (Stripe, QuickBooks, Google Analytics)
- Empty states and placeholders
- Social media logos

### P2 - Medium Priority (Can Wait)

- Advanced illustrations
- Brand suite elements
- Security suite elements
- Directors suite elements
- 3D renders or complex graphics

---

## 📝 NOTES FOR DESIGNERS

1. **Glassmorphic Style:** All cards and containers should have:
   - Semi-transparent backgrounds
   - Backdrop blur (20-24px)
   - Subtle borders (1.5px, 15-25% opacity)
   - Amber glow shadows (12-15% opacity)

2. **Consistency:** All icons should:
   - Use consistent stroke width (1.5-2px)
   - Have rounded corners (2-3px radius)
   - Be centered in their viewBox
   - Work in both light and dark modes

3. **Accessibility:** All elements should:
   - Meet WCAG 2.1 AA contrast requirements
   - Have clear focus states
   - Be keyboard navigable
   - Support screen readers

4. **Performance:** All assets should:
   - Be optimized for web
   - Use appropriate formats
   - Have responsive sizes
   - Load progressively

---

## ✅ COMPLETION CHECKLIST

- [ ] All P0 elements designed and delivered
- [ ] All P1 elements designed and delivered
- [ ] All P2 elements designed and delivered
- [ ] Assets organized in correct folder structure
- [ ] All assets optimized for web
- [ ] Design system tokens documented
- [ ] Component library created in Figma/Sketch
- [ ] Handoff documentation complete

---

**Total Elements Identified:** 200+
**Estimated Design Time:** 80-120 hours
**Recommended Team:** 2-3 designers working in parallel

---

**Next Steps:**

1. Review this list with design team
2. Prioritize P0 elements for immediate work
3. Create design system in Figma/Sketch
4. Begin asset creation with brand guidelines
5. Deliver assets in batches (P0 → P1 → P2)
