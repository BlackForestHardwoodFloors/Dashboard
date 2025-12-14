# Boardroom 360 Global Button System

## Overview

The Boardroom 360 button system features realistic 3D plastic-style buttons with glossy finishes, used consistently throughout the entire application.

## Quick Start

```tsx
import { Button } from './components/Button';
import { Check } from 'lucide-react';

// Basic usage
<Button variant="primary">Click Me</Button>

// With icon
<Button variant="success" icon={<Check />}>Save</Button>

// Full width
<Button variant="danger" fullWidth>Delete All</Button>

// Different sizes
<Button variant="dashboard" size="small">Small</Button>
<Button variant="calendar" size="large">Large</Button>
```

## Features

### 🎨 Realistic 3D Plastic Effects
- **Convex dome surface** - Subtle curved appearance like molded plastic
- **Glossy reflection band** - Shiny highlight across upper third (20-35% opacity)
- **Soft top highlight** - Blends highlight color with white
- **Darker bottom bevel** - Creates depth using shadow color
- **Soft inner shadow** - Simulates curved plastic edges
- **Rounded corners** - Varies by size (8-18px radius)
- **Subtle drop shadow** - Realistic depth, not harsh or metallic

### 🎮 Three Interactive States
1. **Base State** - Balanced gloss and natural 3D volume
2. **Hover State** - Brighter highlight (35% opacity), stronger shadow, slight scale-up
3. **Active/Pressed State** - Inset shadow, reduced gloss, press-down effect

## Button Variants

### Core Menu Colors (14 variants)
| Variant | Color | Use Case |
|---------|-------|----------|
| `dashboard` | Amber (#C9A049) | Dashboard navigation |
| `calendar` | Teal (#3B9CAA) | Calendar/scheduling |
| `client` | Sage (#7BAA8E) | Client management |
| `quotes` | Olive (#6E8B3D) | Quote generation |
| `contracts` | Forest Green (#4F6A41) | Contract signing |
| `jobs` | Dark Olive (#55624C) | Job management |
| `workOrders` | Teal Gray (#4A7268) | Work order tracking |
| `timeSheet` | Coral (#D76A6A) | Time tracking |
| `messages` | Plum (#8A6E8C) | Messaging |
| `photos` | CompanyCam Blue (#0F7BFF) | Photo/media |
| `items` | Gray Olive (#6B6D5E) | Inventory items |
| `vendors` | Tan Gray (#6B6456) | Vendor management |
| `reviews` | Gold (#D4A024) | Reviews/ratings |
| `settings` | Blue Gray (#78909C) | Settings/config |

### Generic Action Colors (6 variants)
| Variant | Color | Use Case |
|---------|-------|----------|
| `primary` | Forest Green (#4F6A41) | Primary actions |
| `secondary` | Blue Gray (#78909C) | Secondary actions |
| `success` | Sage (#7BAA8E) | Success/confirm actions |
| `danger` | Coral (#D76A6A) | Delete/destructive actions |
| `warning` | Gold (#D4A024) | Warning/caution actions |
| `info` | Teal (#3B9CAA) | Informational actions |

## Button Sizes

| Size | Height | Padding | Font Size | Use Case |
|------|--------|---------|-----------|----------|
| `xs` | 28px | 0 12px | 12px | Compact UI, tags |
| `small` | 36px | 0 16px | 13px | Forms, inline actions |
| `medium` | 48px | 0 24px | 15px | Default, most common |
| `large` | 56px | 0 32px | 17px | Primary CTAs |
| `xl` | 64px | 0 40px | 19px | Hero sections |
| `sidebar` | 34px | 0 12px | 13px | Sidebar navigation |

## Props

```typescript
interface ButtonProps {
  variant?: ButtonVariant;           // Color variant (default: 'primary')
  size?: ButtonSize;                 // Size variant (default: 'medium')
  children: ReactNode;               // Button text/content
  onClick?: () => void;              // Click handler
  disabled?: boolean;                // Disabled state (default: false)
  fullWidth?: boolean;               // Full width button (default: false)
  icon?: ReactNode;                  // Icon component (Lucide React)
  iconPosition?: 'left' | 'right';   // Icon position (default: 'left')
  isActive?: boolean;                // Active/selected state (default: false)
  type?: 'button' | 'submit' | 'reset'; // Button type (default: 'button')
  className?: string;                // Additional CSS classes
}
```

## Usage Examples

### Navigation Menu (Sidebar)
```tsx
import { Button } from './components/Button';
import { Home, Calendar, UserCircle } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', variant: 'dashboard' },
  { icon: Calendar, label: 'Calendar', variant: 'calendar' },
  { icon: UserCircle, label: 'Client', variant: 'client' }
];

{menuItems.map((item, index) => (
  <Button
    key={index}
    variant={item.variant}
    size="sidebar"
    fullWidth
    icon={<item.icon />}
    onClick={() => setActiveMenu(index)}
    isActive={activeMenu === index}
  >
    {item.label}
  </Button>
))}
```

### Form Actions
```tsx
import { Button } from './components/Button';
import { Save, X, Trash2 } from 'lucide-react';

<div style={{ display: 'flex', gap: '12px' }}>
  <Button 
    variant="success" 
    icon={<Save />}
    type="submit"
  >
    Save Changes
  </Button>
  
  <Button 
    variant="secondary" 
    icon={<X />}
    onClick={onCancel}
  >
    Cancel
  </Button>
  
  <Button 
    variant="danger" 
    icon={<Trash2 />}
    onClick={onDelete}
  >
    Delete
  </Button>
</div>
```

### Call-to-Action
```tsx
import { Button } from './components/Button';
import { Camera } from 'lucide-react';

<Button 
  variant="photos" 
  size="xl" 
  fullWidth
  icon={<Camera />}
  onClick={openCamera}
>
  Open Camera System
</Button>
```

### Icon-Only Button
```tsx
import { Button } from './components/Button';
import { Settings } from 'lucide-react';

<Button 
  variant="settings" 
  size="small"
  icon={<Settings />}
  onClick={openSettings}
>
  {/* Empty children for icon-only */}
</Button>
```

### Disabled State
```tsx
import { Button } from './components/Button';
import { Check } from 'lucide-react';

<Button 
  variant="success" 
  disabled
  icon={<Check />}
>
  Already Approved
</Button>
```

### Icon on Right
```tsx
import { Button } from './components/Button';
import { ArrowRight } from 'lucide-react';

<Button 
  variant="primary" 
  icon={<ArrowRight />}
  iconPosition="right"
>
  Next Step
</Button>
```

## Color System Details

Each color variant includes 5 precise color values for the plastic effect:

```typescript
{
  base: '#4F6A41',      // Normal state background
  highlight: '#7B9F6C', // Glossy top reflection
  shadow: '#384D2F',    // Bottom bevel depth
  hover: '#628053',     // Hover state background
  active: '#324227'     // Active/pressed state background
}
```

## Best Practices

### ✅ Do
- Use `variant="primary"` for most important action
- Use `variant="danger"` for destructive actions
- Use menu-specific variants (dashboard, calendar, etc.) for navigation
- Use `size="large"` or `size="xl"` for primary CTAs
- Use `fullWidth` for mobile layouts and forms
- Provide meaningful button text (avoid "Click Here")
- Include icons for visual recognition

### ❌ Don't
- Mix multiple primary variants in the same action group
- Use danger variant for non-destructive actions
- Overuse large sizes (reserve for key actions)
- Create button-only navigation without text labels
- Disable buttons without explanation
- Use all caps text (component handles styling)

## Accessibility

The button component includes built-in accessibility features:
- Semantic `<button>` element
- Proper `disabled` attribute handling
- Keyboard support (Enter/Space)
- Focus states
- Clear hover/active states
- Adequate color contrast (WCAG AA compliant)

## Migration Guide

### From Old Button Components

```tsx
// Old way (custom button)
<button 
  style={{ background: '#C9A049', padding: '12px 24px' }}
  onClick={handleClick}
>
  Dashboard
</button>

// New way (plastic button)
import { Button } from './components/Button';

<Button variant="dashboard" onClick={handleClick}>
  Dashboard
</Button>
```

### From PlasticButton (Legacy)

```tsx
// Old import
import { PlasticButton } from './components/PlasticButton';

// New import (recommended)
import { Button } from './components/Button';

// Props are compatible - just rename the component
<Button variant="dashboard" size="medium">
  Dashboard
</Button>
```

## Technical Details

- **Framework**: React with TypeScript
- **Dependencies**: None (vanilla React)
- **File Size**: ~8KB
- **Performance**: Optimized with CSS-in-JS inline styles
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Support**: Touch-optimized with proper tap states

## Location

- Primary: `/components/Button.tsx` (main export)
- Implementation: `/components/ui/button-plastic.tsx` (full component)
- Legacy: `/components/PlasticButton.tsx` (backward compatibility)
- Showcase: `/components/PlasticButtonShowcase.tsx` (demo/examples)

---

**Version**: 1.0.0  
**Last Updated**: November 15, 2024  
**Maintained by**: Boardroom 360 Development Team
