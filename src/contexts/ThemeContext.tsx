import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'female' | 'male';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
    hover: string;
    light: string;
    border: string;
    lightHover: string;
  };
}

const defaultColors = {
  female: {
    primary: 'pink-500',
    secondary: 'rose-500',
    gradient: 'from-pink-400 via-pink-500 to-rose-500',
    hover: 'pink-600',
    light: 'pink-50',
    border: 'pink-100',
    lightHover: 'pink-100'
  },
  male: {
    primary: 'blue-500',
    secondary: 'indigo-500',
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    hover: 'blue-600',
    light: 'blue-50',
    border: 'blue-100',
    lightHover: 'blue-100'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('female');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('gender-theme') as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gender-theme', theme);
  }, [theme]);

  const colors = defaultColors[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 