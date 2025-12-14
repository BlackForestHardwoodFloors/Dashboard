# Boardroom 360 — Complete Button Reference Guide

## 🎨 **COLOR-CODED BUTTON SYSTEM**

This document describes ALL buttons across both the Admin Dashboard and Employee Portal.

---

## 👷 **EMPLOYEE PORTAL BUTTONS**

### **MY JOB SCREEN - EmployeeJobCard.tsx**

#### **Primary Actions (2×2 Grid):**

| Button | Color | Icon | Purpose | Action |
|--------|-------|------|---------|--------|
| **Work Order** | Forest Green<br/>`#4F6A41` | 📄 FileText | View job specifications | Opens work order details |
| **Pictures** | CompanyCam Blue<br/>`#0F7BFF` | 📷 Camera | Launch camera/gallery | Opens camera + photo count badge |
| **Message Client** | Soft Teal<br/>`#3B9CAA` | 💬 MessageCircle | Contact homeowner | Opens messaging interface |
| **Notes** | Warm Brown<br/>`#8B7355` | 📝 StickyNote | Add job notes | Opens note-taking screen |

**Design:** 
- Solid background fill
- 18px padding
- 12px border radius
- 24px icons
- White text
- Badge support (photo count)

#### **Secondary Actions (2×1 Grid):**

| Button | Color | Icon | Purpose | Style |
|--------|-------|------|---------|-------|
| **Stain Sign-Off** | Alert Orange<br/>`#E87722` | ✅ Clipboard | Client stain approval | Outlined (2px border) |
| **Change Orders** | Earth Brown<br/>`#6B5D4F` | 📋 FileEdit | Document changes | Outlined (2px border) |

**Design:**
- Transparent background
- 2px colored border
- Same size as primary actions
- White text

#### **Quick Actions:**

| Button | Color | Icon | Purpose |
|--------|-------|------|---------|
| **Navigate** | Gold outline<br/>`#D4A024` | 📍 MapPin | Open in Google Maps |
| **Call** | Green outline<br/>`#4F6A41` | 📞 Phone | Dial client number |

**Design:**
- Half-width (flex: 1)
- 14px padding
- Dark gray background (#252525)
- Colored border and text

#### **Time Submission:**

| Button | Color | Purpose |
|--------|-------|---------|
| **Submit Time** | Alert Red<br/>`#DC2626` | End of day time submission |

**Design:**
- Full width
- 16px padding
- Large (16px font)
- Box shadow for emphasis
- Appears at bottom of job card

---

### **CALENDAR SCREEN - CalendarScreen.tsx**

#### **View Mode Tabs:**

| Button | Active Color | Purpose |
|--------|--------------|---------|
| **Day** | Gold<br/>`#D4A024` | Show today's jobs |
| **Week** | Gold<br/>`#D4A024` | Show this week |
| **Month** | Gold<br/>`#D4A024` | Show this month |

**Design:**
- Flex: 1 (equal width)
- 12px padding
- Active: Gold background + dark text
- Inactive: Dark background + gray text
- 2px border

#### **Route Button:**

| Button | Color | Icon | Purpose |
|--------|-------|------|---------|
| **View Today's Route** | Green outline<br/>`#4F6A41` | 🗺️ Map | Opens route planning modal |

**Design:**
- Full width
- 14px padding
- Green border and text

#### **Job Block Actions:**

| Button | Color | Icon | Purpose |
|--------|-------|------|---------|
| **Navigate** | Gold<br/>`#D4A024` | 📍 MapPin | Navigate to job |
| **Call** | Green<br/>`#4F6A41` | 📞 Phone | Call client |

**Design:**
- Half-width in flex row
- 10px padding
- Small (13px font)
- Dark background with colored text

---

### **SAFETY & GROWTH SCREEN - SafetyGrowthScreen.tsx**

#### **Main Tiles (3 Large Buttons):**

| Tile | Color | Icon | Purpose |
|------|-------|------|---------|
| **MSDS** | Red<br/>`#DC2626` | 📄 FileText | Safety data sheets |
| **Training Modules** | Blue<br/>`#0F7BFF` | 🎓 GraduationCap | Skill development |
| **My Growth** | Green<br/>`#4F6A41` | 📈 TrendingUp | Progress tracking |

**Design:**
- Full width
- 28px padding
- 120px min-height
- 64×64px icon box
- Gradient background
- Colored border (2px)
- Right chevron indicator

#### **MSDS Detail Badges:**

Hazard pills display in detail view:
- Red background (`#DC2626`)
- Small (12px font)
- Rounded (6px radius)

#### **Training Module Actions:**

| Button | Color | Purpose | Condition |
|--------|-------|---------|-----------|
| **Start Module** | Blue<br/>`#0F7BFF` | Begin training | Not completed |
| **Completed Badge** | Green<br/>`#4F6A41` | Status indicator | Already done |

---

### **BOTTOM NAVIGATION - BottomNavigation.tsx**

| Tab | Icon | Active Color | Purpose |
|-----|------|--------------|---------|
| **My Job** | 💼 Briefcase | Gold<br/>`#D4A024` | Main job screen |
| **Calendar** | 📅 Calendar | Gold<br/>`#D4A024` | Schedule view |
| **Safety & Growth** | 🛡️ Shield | Gold<br/>`#D4A024` | Training/safety |

**Design:**
- 68px min-height
- 28px icons
- 12px labels
- Active: Gold color + top indicator bar
- Inactive: Gray (#808080)
- Fixed to bottom, z-index 1000

---

## 📊 **ADMIN DASHBOARD BUTTONS**

### **PHOTOS PAGE - PhotosPage.tsx**

#### **Carousel Card Buttons:**

**Current Jobsites Cards:**
| Button | Color | Icon | Visibility | Purpose |
|--------|-------|------|------------|---------|
| **Camera** | CompanyCam Blue<br/>`#0F7BFF` | 📷 Camera | Hover only | Quick photo capture |

**Design:**
- 32×32px square
- Top-left corner
- Translucent black → Blue on hover
- Blur backdrop filter
- Opacity transition (0 → 1)

**Badges (Non-interactive):**
- New Photos Badge (top-right, blue pill)
- Employee Initials Badge (bottom-left, blue circle)
- Time Badge (Company Feed cards)
- Distance Badge (Nearby Projects)
- Status Badge (Nearby Projects)

---

### **SIDEBAR - Sidebar.tsx**

#### **14 Menu Items:**

Each has custom color from the spec:
- Different hover colors per item
- Active state with left border
- Icon + label layout

#### **Bottom Actions:**

| Button | Icon | Purpose |
|--------|------|---------|
| **Settings** | ⚙️ Settings | Open settings |
| **Dark Mode Toggle** | 🌙/☀️ Moon/Sun | Theme switch |

---

### **CAMERA - CameraViewfinder.tsx**

| Button | Color | Icon | Purpose |
|--------|-------|------|---------|
| **Capture Photo** | CompanyCam Blue<br/>`#0F7BFF` | 📷 Camera | Take picture |
| **Switch to Video** | Gray | 🎥 Video | Toggle mode |
| **Flash Toggle** | Yellow/Gray | ⚡ Zap | Flash on/off |
| **Markup** | Orange | ✏️ Edit | Add annotations |
| **Measure** | Green | 📏 Ruler | Measurements |

---

## 🎯 **MODE SWITCHER - App.tsx**

| Button | Active Color | Icon | Purpose |
|--------|--------------|------|---------|
| **Employee** | Forest Green<br/>`#4F6A41` | 👷 | Switch to employee portal |
| **Admin** | Gold<br/>`#D4A024` | 📊 | Switch to admin dashboard |

**Location:** Fixed top-right corner
**Design:** Floating pill with 2 toggle buttons

---

## 🎨 **BUTTON HIERARCHY SUMMARY**

### **By Importance:**

1. **Primary CTAs** - Large, solid fill, high contrast
   - Submit Time (Red)
   - Camera (Blue)
   - Main action buttons (Green/Blue)

2. **Secondary Actions** - Outlined or smaller
   - Stain Sign-Off (Orange outline)
   - Change Orders (Brown outline)
   - Navigation buttons (Gold/Green outline)

3. **Navigation** - Tabs and links
   - Bottom nav tabs (Gold active)
   - View mode tabs (Gold active)
   - Sidebar items (Custom colors)

4. **Badges & Indicators** - Non-interactive
   - Photo count badges
   - Employee initials
   - Status pills
   - Hazard warnings

### **By Function:**

- **🟢 Work Actions** - Forest/Sage Green
- **🔵 Photo/Camera** - CompanyCam Blue
- **🟡 Navigation** - Warm Gold
- **🔴 Alerts/Submit** - Red/Orange
- **🟤 Documents** - Earth Brown
- **⚪ Secondary** - Gray/Outlined

---

## 📐 **DESIGN SPECS**

### **Minimum Tap Targets (Mobile):**
- 44×44px minimum for glove use
- Employee portal uses 80px+ heights for main actions

### **Padding Standards:**
- Small buttons: 10-12px
- Medium buttons: 14-16px
- Large buttons: 18-20px

### **Border Radius:**
- Small elements: 8px
- Buttons: 10-12px
- Cards: 12-16px
- Badges: 20px (pill shape)

### **Font Weights:**
- Labels: 600
- Active buttons: 700
- Badges: 700

---

## ✨ **INTERACTION STATES**

All buttons support:
- ✅ **Hover** - Color shift or opacity change
- ✅ **Active/Pressed** - Scale transform (0.98)
- ✅ **Disabled** - Reduced opacity (when needed)
- ✅ **Loading** - Skeleton state (structure ready)

---

**This is your complete button system across both platforms!** 🎨
