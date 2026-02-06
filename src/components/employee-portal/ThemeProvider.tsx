import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentSecondary: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  colors: ThemeColors;
  employeeColor: string;
}

const lightColors: ThemeColors = {
  background: '#F5F5F5',
  backgroundSecondary: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  accent: '#4F6A41',
  accentSecondary: '#3B82F6',
};

const darkColors: ThemeColors = {
  background: '#121212',
  backgroundSecondary: '#1F1F1F',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#2A2A2A',
  accent: '#4F6A41',
  accentSecondary: '#60A5FA',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDark, setIsDark] = useState(defaultTheme === 'dark');

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  const colors = isDark ? darkColors : lightColors;
  const employeeColor = '#4F6A41'; // Green accent for employee portal

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, colors, employeeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default dark theme if used outside provider
    return {
      theme: 'dark' as Theme,
      setTheme: () => {},
      isDark: true,
      colors: darkColors,
      employeeColor: '#4F6A41'
    };
  }
  return context;
}

export function ThemeToggleButton() {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
        border: `1px solid ${isDark ? '#3A3A3A' : '#E5E7EB'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease'
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={20} color="#FCD34D" />
      ) : (
        <Moon size={20} color="#6B7280" />
      )}
    </button>
  );
}

export default ThemeProvider;
