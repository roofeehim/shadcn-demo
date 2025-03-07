import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

export function ThemeToggle() {
  // マウント状態を追跡
  const [mounted, setMounted] = React.useState(false);
  
  // マウント後に操作可能に
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // マウントされるまではダミーボタンを表示
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-5 w-5" />
        <span className="sr-only">テーマ切り替えボタン</span>
      </Button>
    );
  }
  
  // マウント後はuseThemeを使用
  const { isDark, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      </span>
    </Button>
  );
} 