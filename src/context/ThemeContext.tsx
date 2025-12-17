import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  // Theme colors for easy access
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentDark: string;
    borderColor: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const darkColors = {
  bgPrimary: '#1E1E1E',
  bgSecondary: '#2D2D2D',
  bgCard: '#2D2D2D',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#C9A049',
  accentDark: '#A88438',
  borderColor: '#3D3D3D',
};

const lightColors = {
  bgPrimary: '#F5F7FA',
  bgSecondary: '#FFFFFF',
  bgCard: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  accent: '#C9A049',
  accentDark: '#A88438',
  borderColor: '#E0E0E0',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('boardroom-theme');
    return (savedTheme as Theme) || 'dark';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('boardroom-theme', theme);
    // Update document attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme, 
      isDark: theme === 'dark',
      colors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for components that need theme colors but may be outside provider
export function useThemeColors() {
  const context = useContext(ThemeContext);
  if (context) {
    return context.colors;
  }
  // Default to dark theme colors if no provider
  return darkColors;
}
