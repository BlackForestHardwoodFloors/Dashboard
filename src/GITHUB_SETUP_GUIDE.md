# 📦 Boardroom 360 - GitHub Setup Guide

Complete guide to clone your Boardroom 360 project to GitHub with all necessary configuration files.

---

## 📁 Project Structure

```
boardroom-360/
├── src/
│   ├── components/
│   │   ├── ui/              # 40+ UI components
│   │   ├── figma/           # Figma-specific components
│   │   ├── BoardroomDashboard.tsx
│   │   ├── BoardroomNewClientModal.tsx
│   │   ├── EmployeePortal.tsx
│   │   ├── PhotosPage.tsx
│   │   ├── TimeLogsPage.tsx
│   │   ├── CalendarPage.tsx
│   │   └── ... (80+ components total)
│   ├── styles/
│   │   └── globals.css      # 317 lines of Tailwind v4 config
│   ├── App.tsx              # Main app with mode switcher
│   ├── main.tsx             # Vite entry point
│   └── vite-env.d.ts        # TypeScript definitions
├── public/
│   └── index.html
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔧 Configuration Files

### 1. **package.json**

```json
{
  "name": "boardroom-360",
  "version": "1.0.0",
  "description": "Complete mobile-first flooring industry management system with camera integration, job tracking, and admin dashboard",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0",
    "recharts": "^2.10.0",
    "react-hook-form": "7.55.0",
    "motion": "^10.18.0",
    "sonner": "2.0.3",
    "date-fns": "^3.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "react-slick": "^0.30.0",
    "slick-carousel": "^1.8.1",
    "react-responsive-masonry": "^2.1.7",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "@popperjs/core": "^2.11.8",
    "react-popper": "^2.3.0",
    "re-resizable": "^6.9.11"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@types/react-slick": "^0.23.13",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0-alpha.25",
    "@tailwindcss/vite": "^4.0.0-alpha.25",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  },
  "keywords": [
    "boardroom-360",
    "flooring",
    "camera",
    "job-tracking",
    "admin-dashboard",
    "employee-portal",
    "companycam"
  ],
  "author": "Your Name",
  "license": "PROPRIETARY"
}
```

---

### 2. **vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

---

### 3. **tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 4. **tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

### 5. **vite-env.d.ts** (in src/)

```typescript
/// <reference types="vite/client" />
```

---

### 6. **.gitignore**

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vite
.vite
```

---

### 7. **README.md**

````markdown
# 🏢 Boardroom 360 Employee Portal

Complete mobile-first flooring industry management system with integrated camera functionality, job tracking, and comprehensive admin dashboard.

![Boardroom 360 Banner](https://via.placeholder.com/1200x400/1B1C1D/C9A049?text=Boardroom+360)

---

## 🎯 Features

### 🔧 Admin Dashboard

- **Dark Theme Design** - Dark charcoal background (#1B1C1D) with gold accents (#C9A049)
- **New Client Modal** - 4-section comprehensive client intake form
- **Photo Management** - CompanyCam Blue (#0F7BFF) themed gallery with mobile-responsive sidebar
- **Time Logs** - Employee time tracking with gold-themed navigation
- **Calendar** - Job scheduling and appointment management
- **Mobile-Responsive Navigation** - Collapsible sidebar drawers with hamburger menus

### 👷 Employee Portal

- **3-Tab Bottom Navigation** - My Job, Calendar, Safety & Growth
- **Job Cards** - Click to reveal 6 large action buttons (Work Order, Change Order, Stain Sign-Off, Call, Message, Notes)
- **Large Tap Targets** - Optimized for on-site crew members with gloves
- **Boardroom Green Theme** - #4F6A41 and #55624C accents

### 📸 Camera System

- **CompanyCam Blue UI** - #0F7BFF primary camera interface
- **Auto Job Linking** - Launches from Job Cards and automatically links media
- **Metadata Capture** - Client, address, and timeline information
- **P4P Support** - Pay for Performance documentation system

### 🎨 Color System

- **CompanyCam Blue:** `#0F7BFF` - Camera UI primary
- **Boardroom Gold:** `#C9A049` - Admin dashboard primary buttons
- **Boardroom Green:** `#4F6A41`, `#55624C` - Employee portal accents
- **Customer Portal Teal:** `#06B6D4` - Customer-facing interface
- **Deep Indigo:** `#1E3A8A` - Bold & confident theme accent
- **Dark Charcoal:** `#1B1C1D` - Admin dashboard background
- **Soft Card Panels:** `#232425` - Admin dashboard cards

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/boardroom-360.git
cd boardroom-360

# Install dependencies
npm install

# Start development server
npm run dev
```
````

The app will open at `http://localhost:3000`

---

## 📦 Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS v4.0 (with @theme inline)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animations:** Motion (Framer Motion)
- **Forms:** React Hook Form 7.55.0
- **Notifications:** Sonner 2.0.3
- **Date Handling:** date-fns

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                  # 40+ reusable UI components
│   ├── figma/               # Figma-specific components
│   ├── BoardroomDashboard.tsx
│   ├── BoardroomNewClientModal.tsx
│   ├── EmployeePortal.tsx
│   ├── PhotosPage.tsx
│   ├── TimeLogsPage.tsx
│   ├── CalendarPage.tsx
│   └── ... (80+ components)
├── styles/
│   └── globals.css          # Tailwind v4 configuration
├── App.tsx                  # Main app with mode switcher
└── main.tsx                 # Vite entry point
```

---

## 🎨 Design System

### Typography

- **2XL:** 1.5rem (24px) - Main headings
- **XL:** 1.25rem (20px) - Section headings
- **LG:** 1.125rem (18px) - Subsection headings
- **Base:** 1rem (16px) - Body text
- **SM:** 0.875rem (14px) - Labels
- **XS:** 0.75rem (12px) - Captions

### Spacing

- **Radius:** 0.625rem (10px) base
- **Radius SM:** 6px
- **Radius MD:** 8px
- **Radius LG:** 10px
- **Radius XL:** 14px

### Custom Scrollbars

- **Vertical Scroll:** Gold (#D4A024) thumb on dark track
- **Carousel Scroll:** CompanyCam Blue (#0F7BFF) thumb

---

## 📱 Responsive Design

- **Mobile-First:** Optimized for phone screens
- **Large Touch Targets:** 44px minimum for accessibility
- **Collapsible Sidebars:** Hamburger menus on mobile
- **Grid Layouts:** Responsive 2-4 column grids

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Boardroom 360
VITE_API_URL=your_api_url_here
VITE_COMPANYCAM_API_KEY=your_key_here
```

---

## 🛠️ Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📸 Screenshots

### Admin Dashboard

![Admin Dashboard](https://via.placeholder.com/800x600/1B1C1D/C9A049?text=Admin+Dashboard)

### Employee Portal

![Employee Portal](https://via.placeholder.com/800x600/4F6A41/FFFFFF?text=Employee+Portal)

### Camera System

![Camera System](https://via.placeholder.com/800x600/0F7BFF/FFFFFF?text=Camera+System)

---

## 📄 License

**Proprietary** - All rights reserved

---

## 🤝 Contributing

This is a proprietary project. Contact the repository owner for collaboration opportunities.

---

## 📞 Support

For support, email support@boardroom360.com

---

**Built with ❤️ for the flooring industry**

````

---

### 8. **public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Boardroom 360 - Complete flooring industry management system" />
    <title>Boardroom 360 Employee Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
````

---

### 9. **src/main.tsx** (renamed from index.tsx for Vite)

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppBootstrap } from './components/AppBootstrap'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppBootstrap>
      <App />
    </AppBootstrap>
  </React.StrictMode>,
)
```

---

## 🚀 GitHub Setup Commands

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Initial commit
git commit -m "Initial commit: Boardroom 360 Employee Portal with Admin Dashboard, Camera System, and Mobile-Responsive Navigation"

# 4. Create GitHub repo (via web interface), then:
git remote add origin https://github.com/YOUR_USERNAME/boardroom-360.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## ✅ Pre-Deployment Checklist

- [ ] All 80+ components copied to `/src/components/`
- [ ] `globals.css` in `/src/styles/`
- [ ] Configuration files created (package.json, vite.config.ts, tsconfig.json)
- [ ] Dependencies installed (`npm install`)
- [ ] App runs locally (`npm run dev`)
- [ ] Git initialized
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] README.md with project details
- [ ] .gitignore configured

---

## 🎯 Next Steps

1. **Clone locally** - Copy all files to your local machine
2. **Install dependencies** - `npm install`
3. **Test locally** - `npm run dev`
4. **Push to GitHub** - Follow commands above
5. **Deploy** - Consider Vercel, Netlify, or Cloudflare Pages

---

**Your Boardroom 360 project is now ready for GitHub! 🎉**