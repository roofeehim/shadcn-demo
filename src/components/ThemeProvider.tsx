import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
};

// デフォルト値を設定
const defaultContextValue: ThemeContextType = {
  isDark: false,
  toggle: () => {}
};

// コンテキスト作成
const ThemeContext = React.createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  // 初期化 - マウント時に実行
  React.useEffect(() => {
    const darkMode = document.documentElement.classList.contains("dark");
    setIsDark(darkMode);
    setMounted(true);
    console.log("ThemeProvider initialized, dark mode:", darkMode);
  }, []);

  // テーマ切り替え関数
  const toggle = React.useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      console.log("Toggle theme to:", newValue ? "dark" : "light");
      return newValue;
    });
  }, []);

  // テーマが変わったらDOMに反映
  React.useEffect(() => {
    if (!mounted) return;
    
    console.log("Applying theme to DOM:", isDark ? "dark" : "light");
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, mounted]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggle
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
} 