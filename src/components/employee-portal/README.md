# Employee Portal - Complete Feature Build

## 📁 File Structure

```
employee-portal/
├── EmployeePortal.tsx        # Main orchestrator component
├── BottomNavigation.tsx      # Bottom nav with 5 tabs
├── ThemeProvider.tsx         # Light/Dark/System theme support
│
└── screens/
    ├── JobsScreen.tsx        # Home - jobs list, quick actions
    ├── PhotosScreen.tsx      # Photo gallery, filter, share, annotate
    ├── MessagesScreen.tsx    # Client & team messaging
    ├── MeScreen.tsx          # Profile, reviews, growth, training, time
    ├── JobDetailScreen.tsx   # Job details, change orders, stain sign off
    └── CameraCaptureScreen.tsx # Camera with GPS, voice-to-room
```

## 📱 Navigation Structure

```
Bottom Nav:
[🏠 Jobs] [📸 Photos] [📷 CAMERA] [💬 Messages] [👤 Me]
```

## ✅ Features Implemented (17 Total)

| # | Feature | Screen | Status |
|---|---------|--------|--------|
| 1 | **Calendar** | JobsScreen / MeScreen | ✅ |
| 2 | **Time Off Requests** | MeScreen → Calendar | ✅ |
| 3 | **Job Cards** | JobsScreen | ✅ |
| 4 | **Report Time** | MeScreen → Time | ✅ |
| 5 | **Take Photos** | CameraCaptureScreen | ✅ |
| 6 | **View Photos** | PhotosScreen | ✅ |
| 7 | **Annotate Photos** | PhotosScreen (button) | ✅ (UI ready) |
| 8 | **Share Photos** | PhotosScreen | ✅ |
| 9 | **Client Messaging** | MessagesScreen | ✅ |
| 10 | **Team Chat** | MessagesScreen | ✅ |
| 11 | **Change Orders** | JobDetailScreen | ✅ |
| 12 | **Stain Sign Off** | JobDetailScreen | ✅ |
| 13 | **Customer Reviews** | MeScreen → Reviews | ✅ |
| 14 | **Employee Record** | MeScreen (stats) | ✅ |
| 15 | **Growth Path** | MeScreen → Growth | ✅ |
| 16 | **Training Videos** | MeScreen → Training | ✅ |
| 17 | **MSDS Sheets** | MeScreen / JobDetailScreen | ✅ |

## 🚀 Installation

### Option 1: Replace entire components folder section

Copy the `employee-portal/` folder to `src/components/employee-portal/`

Then update your `App.tsx`:

```tsx
import { EmployeePortal } from './components/employee-portal/EmployeePortal';

// In your render:
{currentPortal === 'employee' && <EmployeePortal />}
```

### Option 2: Merge into existing components

Copy individual files to `src/components/` and update imports as needed.

## 🎨 Theme Support

The portal supports Light, Dark, and System themes:

```tsx
import { useTheme } from './ThemeProvider';

function MyComponent() {
  const { colors, toggleTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: colors.background }}>
      {/* Your content */}
    </div>
  );
}
```

## 📱 Screen Details

### Jobs Screen (Home)
- Welcome header with date
- Quick action tiles (Calendar, P4P, Growth)
- Weekly job list grouped by status
- Job cards with progress bars
- Tap job to open detail view

### Photos Screen
- Photo gallery with grid view
- Filter: All / My Jobs / By Job
- Search by room, phase, job name
- Tap photo for detail view
- Share to Admin or Customer Portal
- Annotate button (ready for implementation)

### Messages Screen
- Two tabs: Clients / Team
- Client messages (admin visible)
- Team chat
- Real-time-style chat UI
- Quick message templates

### Me Screen
- Profile header with stats
- Customer Reviews list
- Growth Path (skill levels)
- Training Video library
- Report Time (clock in/out)
- Calendar & Time Off requests
- MSDS Sheets library
- Settings & Logout

### Job Detail Screen
- Progress bar with hours
- Address with navigation link
- Job briefing
- Crew list
- Materials list
- Change Orders (create new)
- Stain Sign Off (signature pad)
- MSDS for job materials
- Quick message to client

### Camera Screen
- GPS verification
- Voice-to-room tagging
- Phase selection
- Notes input
- Job selection
- Add custom rooms

## 🔌 API Integration Points

The components use sample data. To connect to your backend:

1. **Jobs**: Replace `sampleJobs` in EmployeePortal.tsx with API fetch
2. **Photos**: Replace `samplePhotos` with API fetch
3. **Messages**: Connect to your messaging backend
4. **Employee**: Fetch from auth/user endpoint
5. **Time Off**: POST to your time-off-requests endpoint
6. **Change Orders**: POST to your change-orders endpoint

## 📝 Notes

- All screens support safe area insets (notch, home indicator)
- Touch targets are 44px+ for accessibility
- Smooth transitions between screens
- Loading states ready for async operations
