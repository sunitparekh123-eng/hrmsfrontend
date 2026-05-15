"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
  contrastLevel: number;
  setContrastLevel: (level: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [contrastLevel, setContrastLevelState] = useState<number>(0);

  useEffect(() => {
    const savedSize = localStorage.getItem("appFontSize");
    if (savedSize) {
      setFontSizeState(parseInt(savedSize, 10));
    }
    const savedContrast = localStorage.getItem("appContrastLevel");
    if (savedContrast) {
      setContrastLevelState(parseInt(savedContrast, 10));
    }
  }, []);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem("appFontSize", size.toString());
  };

  const setContrastLevel = (level: number) => {
    setContrastLevelState(level);
    localStorage.setItem("appContrastLevel", level.toString());
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.style.setProperty('--contrast-level', (contrastLevel / 100).toString());
    if (contrastLevel > 0) {
      document.body.classList.add("dynamic-contrast");
      document.body.classList.remove("high-contrast");
    } else {
      document.body.classList.remove("dynamic-contrast");
    }
  }, [contrastLevel]);

  return (
    <ThemeContext.Provider value={{ fontSize, setFontSize, contrastLevel, setContrastLevel }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
