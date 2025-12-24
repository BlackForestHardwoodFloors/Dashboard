import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colors: ThemeColors;
  employeeColor: string;
  setEmployeeColor: (color: string) => void;
}

interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  overlay: string;
  shadow: string;
  phaseBefore: string;
  phaseDemo: string;
  phasePrep: string;
  phaseInstall: string;
  phaseSand: string;
  phaseStain: string;
  phaseFinish: string;
  phaseAfter: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F7',
  backgroundTertiary: '#E8E8ED',
  backgroundElevated: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  accent: '#0F7BFF',
  accentHover: '#0A5FCC',
  accentLight: 'rgba(15, 123, 255, 0.1)',
  success: '#34C759',
  successLight: 'rgba(52, 199, 89, 0.1)',
  warning: '#FF9500',
  warningLight: 'rgba(255, 149, 0, 0.1)',
  error: '#FF3B30',
  errorLight: 'rgba(255, 59, 48, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  phaseBefore: '#F4B400',
  phaseDemo: '#E74C3C',
  phasePrep: '#9B59B6',
  phaseInstall: '#3498DB',
  phaseSand: '#95A5A6',
  phaseStain: '#8B4513',
  phaseFinish: '#27AE60',
  phaseAfter: '#4CAF50',
};

const darkColors: ThemeColors = {
  background: '#0A0A0A',
  backgroundSecondary: '#1A1A1A',
  backgroundTertiary: '#2A2A2A',
  backgroundElevated: '#1F1F1F',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  textInverse: '#000000',
  border: '#2A2A2A',
  borderLight: '#3D3D3D',
  accent: '#0F7BFF',
  accentHover: '#3D9AFF',
  accentLight: 'rgba(15, 123, 255, 0.2)',
  success: '#7BAA8E',
  successLight: 'rgba(123, 170, 142, 0.2)',
  warning: '#D4A024',
  warningLight: 'rgba(212, 160, 36, 0.2)',
  error: '#E74C3C',
  errorLight: 'rgba(231, 76, 60, 0.2)',
  overlay: 'rgba(0, 0, 0, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.4)',
  phaseBefore: '#F4B400',
  phaseDemo: '#E74C3C',
  phasePrep: '#9B59B6',
  phaseInstall: '#3498DB',
  phaseSand: '#95A5A6',
  phaseStain: '#8B4513',
  phaseFinish: '#27AE60',
  phaseAfter: '#4CAF50',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'boardroom360-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return defaultTheme;
  });

  // Employee color from settings
  const [employeeColor, setEmployeeColorState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boardroom360-employee-color');
      if (stored) return stored;
    }
    return '#D4A024'; // Default gold
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Fetch employee color from backend
  useEffect(() => {
    const fetchEmployeeColor = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('http://localhost:3001/employee/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.color) {
            setEmployeeColorState(data.color);
            localStorage.setItem('boardroom360-employee-color', data.color);
          }
        }
      } catch (error) {
        console.log('Using default employee color');
      }
    };
    fetchEmployeeColor();
  }, []);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;
  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const setEmployeeColor = (newColor: string) => {
    setEmployeeColorState(newColor);
    localStorage.setItem('boardroom360-employee-color', newColor);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
    root.style.setProperty('--employee-color', employeeColor);
    root.setAttribute('data-theme', resolvedTheme);
  }, [colors, resolvedTheme, employeeColor]);

  return (
    <ThemeContext.Provider value={{ 
      theme, resolvedTheme, setTheme, toggleTheme, colors, employeeColor, setEmployeeColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeToggleButton() {
  const { resolvedTheme, toggleTheme, colors } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.backgroundSecondary,
        color: colors.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export { lightColors, darkColors };
export type { ThemeColors, Theme, ResolvedTheme };
