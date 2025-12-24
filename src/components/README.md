# Boardroom 360 - Photo System Update

## File Placement

Place these files in your project:

```
src/
├── App.tsx                          ← REPLACE your existing App.tsx
│
└── components/
    ├── ThemeProvider.tsx            ← NEW (theme system)
    ├── PortalPreview.tsx            ← NEW (preview tool)
    ├── EmployeePortal.tsx           ← REPLACE
    ├── EmployeePhotosScreen.tsx     ← NEW
    ├── CameraCaptureScreen.tsx      ← NEW
    ├── BottomNavigation.tsx         ← REPLACE
    ├── MyJobScreen.tsx              ← REPLACE
    ├── EmployeeJobCard.tsx          ← REPLACE
    ├── PhotoCard.tsx                ← REPLACE
    ├── PhotosPage.tsx               ← REPLACE (admin photos)
    ├── CalendarScreen.tsx           ← NEW (placeholder)
    └── SafetyGrowthScreen.tsx       ← NEW
```

## Quick Start

1. Extract all files to their locations above
2. Run your dev server: `npm run dev`
3. Visit: `http://localhost:5173/preview`

## Preview Routes

| URL | What You'll See |
|-----|-----------------|
| `/preview` | Portal Preview Tool (switch between Employee/Customer, devices, themes) |
| `/employee/login` | Employee Login Page |
| `/customer/login` | Customer Login Page |
| `/admin/login` | Admin Login Page |

## Features Included

### Employee Portal
- ✅ GPS-verified photo capture
- ✅ Voice-to-room tagging ("Say 'Living Room'")
- ✅ Dynamic room management per job
- ✅ Photo gallery with swipe navigation
- ✅ Pull-to-refresh
- ✅ Light/Dark/System theme support
- ✅ Mobile-optimized touch gestures
- ✅ Tooltips for new features

### Preview Tool
- ✅ Device frames (iPhone, iPad, Desktop)
- ✅ Split view (Employee + Customer side-by-side)
- ✅ Fullscreen mode
- ✅ Theme toggle

## Theme System

The new ThemeProvider replaces hardcoded colors with CSS variables:

```tsx
import { useTheme } from './ThemeProvider';

function MyComponent() {
  const { colors, toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: colors.background }}>
      {/* Your content */}
    </div>
  );
}
```

## Notes

- The camera screen stays dark (for visibility while capturing)
- Theme preference is saved to localStorage
- System theme changes are detected automatically
