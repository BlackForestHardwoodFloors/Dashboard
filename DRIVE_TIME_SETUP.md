# 🚗 Drive-Time Reminders - Complete Setup Guide

## Overview

The Drive-Time Reminder feature automatically calculates travel time to appointments using Google Maps and sends reminders to the **assigned employee** based on **their GPS location**.

### Notification Channels:
- ✅ In-app notifications (floating panel)
- ✅ SMS text messages
- ✅ Email

### Key Features:
- **Uses the assigned employee's GPS location** (not the viewer's)
- Employees share their location via Employee Portal
- Master enable/disable toggle (admin only)
- Per-employee settings (channels, timing)
- Per-appointment toggle in booking form
- Auto-enabled for "Onsite Visit" appointments
- Only the assigned employee receives reminders

---

## 📦 Files Included

### Frontend Files (copy to `src/components/`)

| File | Description |
|------|-------------|
| `DriveTimeService.ts` | Drive time calculation, settings |
| `DriveTimeReminder.tsx` | Floating notifications for Calendar |
| `DriveTimeSettings.tsx` | Admin settings for Communication Hub |
| `EmployeeLocationService.ts` | GPS location tracking |
| `EmployeeLocationTracker.tsx` | Location UI for Employee Portal |

### Backend Files

| File | Copy To |
|------|---------|
| `communicationsController.ts` | `backend/src/controllers/` |
| `communicationsRoutes.ts` | `backend/src/routes/` |
| `employeeLocationController.ts` | `backend/src/controllers/` |
| `employeeLocationRoutes.ts` | `backend/src/routes/` |

---

## 🔄 How It Works

```
EMPLOYEE PORTAL                         DATABASE
┌────────────────────┐                  ┌──────────────┐
│ 📍 Location: ON    │ ──────────────▶  │ employee_id  │
│ GPS: 47.65, -117.4 │   Every 5 min    │ lat, lng     │
│ [Update] [Check-In]│                  │ timestamp    │
└────────────────────┘                  └──────────────┘
                                               │
CALENDAR                                       │
┌────────────────────────────────────┐         │
│ Appointment: 2:00 PM               │         │
│ Employee: Mike Thompson ◀──────────┼─────────┘
│ Address: 1234 Oak St               │   Gets Mike's
│ [✓] Drive-Time Reminder            │   location
└────────────────────────────────────┘
         │
         ▼
REMINDER → SMS + Email + In-App to Mike
```

---

## 🔧 Installation Steps

### STEP 1: Copy Frontend Files

Copy these 5 files to `src/components/`:
- `DriveTimeService.ts`
- `DriveTimeReminder.tsx`
- `DriveTimeSettings.tsx`
- `EmployeeLocationService.ts`
- `EmployeeLocationTracker.tsx`

---

### STEP 2: Update CalendarPage.tsx

**Add imports:**
```tsx
import DriveTimeReminder from './DriveTimeReminder';
import { isFeatureEnabled } from './DriveTimeService';
import { Car } from 'lucide-react';
```

**Add to FormData interface:**
```tsx
sendDriveTimeReminder: boolean;
```

**Add to initialFormData:**
```tsx
sendDriveTimeReminder: true
```

**Add current user state:**
```tsx
const [currentUser, setCurrentUser] = useState<{ id: number; role: string } | null>(null);

useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    setCurrentUser({ id: user.id, role: user.role });
  }
}, []);
```

**Update handleInputChange (auto-toggle for Onsite Visit):**
```tsx
if (name === 'purpose') {
  const shouldEnableReminder = value === 'Onsite Visit';
  setFormData(prev => ({ ...prev, [name]: value, sendDriveTimeReminder: shouldEnableReminder }));
  return;
}
```

**Add toggle in form (after Description):**
```tsx
{formData.employeeName && isFeatureEnabled() && (
  <div style={{...}}>
    <Car /> Drive-Time Reminder
    <input type="checkbox" checked={formData.sendDriveTimeReminder} onChange={...} />
  </div>
)}
```

**Add component (before closing div):**
```tsx
<DriveTimeReminder
  appointments={appointments}
  employees={employees}
  currentUserId={currentUser?.id}
  isAdmin={currentUser?.role === 'admin' || currentUser?.role === 'manager'}
  darkMode={true}
/>
```

---

### STEP 3: Update CommunicationHubPage.tsx

**Add imports:**
```tsx
import DriveTimeSettings from './DriveTimeSettings';
import { Car } from 'lucide-react';
```

**Add employees state and fetch useEffect**

**Add to renderAutomations:**
```tsx
<DriveTimeSettings employees={employees} darkMode={darkMode} compact={false} />
```

---

### STEP 4: Add to Employee Portal

```tsx
import EmployeeLocationTracker from './EmployeeLocationTracker';

<EmployeeLocationTracker
  employeeId={currentEmployee.id}
  employeeName={`${currentEmployee.firstName} ${currentEmployee.lastName}`}
  darkMode={true}
/>
```

---

### STEP 5: Backend Setup

**Copy files:**
- `communicationsController.ts` → `backend/src/controllers/`
- `communicationsRoutes.ts` → `backend/src/routes/`
- `employeeLocationController.ts` → `backend/src/controllers/`
- `employeeLocationRoutes.ts` → `backend/src/routes/`

**Install packages:**
```bash
npm install twilio nodemailer
npm install @types/nodemailer --save-dev
```

**Register routes:**
```typescript
import communicationsRoutes from './routes/communicationsRoutes';
import employeeLocationRoutes from './routes/employeeLocationRoutes';

app.use('/communications', communicationsRoutes);
app.use('/employee', employeeLocationRoutes);
```

---

### STEP 6: Database Migration

**Prisma schema:**
```prisma
model EmployeeLocation {
  id          Int       @id @default(autoincrement())
  employeeId  Int       @unique
  latitude    Float
  longitude   Float
  accuracy    Float     @default(0)
  timestamp   DateTime  @default(now())
  address     String?
  source      String    @default("gps")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  employee    Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
}
```

**Run migration:**
```bash
npx prisma migrate dev --name add_employee_location
```

---

### STEP 7: Environment Variables

**Backend `.env`:**
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@yourcompany.com
```

**Frontend `.env`:**
```env
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_API_URL=http://localhost:3001
```

---

### STEP 8: Enable Google Maps Directions API

1. Go to Google Cloud Console
2. Enable "Directions API"
3. Make sure your API key has access

---

## ✅ Testing Checklist

- [ ] Employee enables location sharing in portal
- [ ] Employee location shows in admin panel
- [ ] Onsite Visit → toggle ON by default
- [ ] Other purposes → toggle OFF by default
- [ ] Notification appears when time to leave
- [ ] Navigate button opens Google Maps
- [ ] SMS sends to employee
- [ ] Email sends to employee
