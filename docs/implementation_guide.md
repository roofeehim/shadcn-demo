---
title: "shadcn+Astro 実装ガイドライン"
description: "Astroプロジェクトにshadcn/uiを導入・実装するための詳細ガイド"
version: "1.0.0"
lastUpdated: "2024-06-04"
author: "開発チーム"
---

# Astroプロジェクトでのshadcn実装ガイドライン

このドキュメントでは、Astroプロジェクトでshadcn/uiを効果的に実装するための具体的なガイドラインと手順を提供します。

## 1. プロジェクト初期設定

### 1.1 Astroプロジェクト作成

```bash
# プロジェクト作成
pnpm create astro@latest my-shadcn-site

# 依存関係のインストール
cd my-shadcn-site
pnpm install
```

### 1.2 Reactの追加

```bash
pnpm astro add react
```

### 1.3 TailwindCSSの追加

```bash
pnpm astro add tailwind
```

### 1.4 TypeScriptの設定

`tsconfig.json`に以下の設定を追加：

```json
{
  "extends": "astro/tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 2. shadcn/uiのセットアップ

### 2.1 依存関係のインストール

```bash
pnpm add -D @shadcn/ui
pnpm add class-variance-authority clsx tailwind-merge
pnpm add cmdk
pnpm add @radix-ui/react-icons lucide-react
```

### 2.2 設定ファイルの作成

`components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.mjs",
    "css": "src/styles/global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 2.3 ユーティリティ関数の設定

`src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 2.4 Tailwind設定の更新

`tailwind.config.mjs`:

```javascript
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 2.5 グローバルCSSの設定

`src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;

    --primary: 173 80% 40%;
    --primary-foreground: 210 40% 98%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;

    --accent: 38 92% 50%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --ring: 215 20.2% 65.1%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;

    --primary: 173 80% 36%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;

    --accent: 38 92% 50%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 85.7% 97.3%;

    --ring: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 3. コンポーネントの実装

### 3.1 コンポーネントの追加

```bash
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add dialog
```

### 3.2 コンポーネントの使用方法

#### Button コンポーネント例

```tsx
// src/components/examples/ButtonExample.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

export default function ButtonExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2">
        <Button size="default">Default Size</Button>
        <Button size="sm">Small Size</Button>
        <Button size="lg">Large Size</Button>
      </div>
    </div>
  );
}
```

#### Astroページでの使用

```astro
---
// src/pages/components.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import ButtonExample from '../components/examples/ButtonExample';
---

<BaseLayout title="コンポーネント例">
  <div class="container py-10">
    <h1 class="text-3xl font-bold mb-6">Buttonコンポーネント</h1>
    <div class="p-6 border rounded-lg bg-white">
      <ButtonExample client:visible />
    </div>
  </div>
</BaseLayout>
```

### 3.3 カスタムコンポーネント

カスタムコンポーネントを作成する際は、shadcnのパターンに従います：

```tsx
// src/components/custom/feature-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader>
        <div className="mb-2 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
```

## 4. レイアウトとページ構造

### 4.1 基本レイアウト

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Astro + shadcnデモサイト' } = Astro.props;
---

<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <ViewTransitions />
  </head>
  <body>
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

### 4.2 ヘッダーコンポーネント

```astro
---
// src/components/Header.astro
import { ThemeToggle } from './ThemeToggle';
---

<header class="border-b bg-background">
  <div class="container flex items-center justify-between h-16">
    <a href="/" class="font-semibold text-lg">
      shadcn Demo
    </a>
    <nav class="hidden md:flex gap-6">
      <a href="/" class="hover:text-primary transition-colors">ホーム</a>
      <a href="/features" class="hover:text-primary transition-colors">特徴</a>
      <a href="/components" class="hover:text-primary transition-colors">コンポーネント</a>
      <a href="/form-example" class="hover:text-primary transition-colors">フォーム例</a>
      <a href="/docs" class="hover:text-primary transition-colors">ドキュメント</a>
      <a href="/contact" class="hover:text-primary transition-colors">お問い合わせ</a>
    </nav>
    <div class="flex items-center gap-2">
      <ThemeToggle client:load />
    </div>
  </div>
</header>
```

### 4.3 フッターコンポーネント

```astro
---
// src/components/Footer.astro
---

<footer class="border-t bg-muted/40 py-8">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 class="font-semibold mb-3">shadcn Demo</h3>
        <p class="text-sm text-muted-foreground">
          Astroとshadcn/uiを活用した高性能なウェブサイト制作のデモです。
        </p>
      </div>
      <div>
        <h3 class="font-semibold mb-3">ページ</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/" class="hover:underline">ホーム</a></li>
          <li><a href="/features" class="hover:underline">特徴</a></li>
          <li><a href="/components" class="hover:underline">コンポーネント</a></li>
          <li><a href="/form-example" class="hover:underline">フォーム例</a></li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold mb-3">リソース</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/docs" class="hover:underline">ドキュメント</a></li>
          <li><a href="https://ui.shadcn.com" class="hover:underline">shadcn/ui</a></li>
          <li><a href="https://astro.build" class="hover:underline">Astro</a></li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold mb-3">お問い合わせ</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/contact" class="hover:underline">お問い合わせフォーム</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} shadcn Demo. All rights reserved.
    </div>
  </div>
</footer>
```

## 5. テーマ切り替え実装

### 5.1 テーマプロバイダー

```tsx
// src/components/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
```

### 5.2 テーマトグルコンポーネント

```tsx
// src/components/ThemeToggle.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled className="w-9 h-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">テーマ切り替え</span>
    </Button>
  );
}
```

### 5.3 Astroでのプロバイダー設定

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from 'astro:transitions';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { ThemeProvider } from '../components/ThemeProvider';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Astro + shadcnデモサイト' } = Astro.props;
---

<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <ViewTransitions />
    <script is:inline>
      const theme = (() => {
        if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
          return localStorage.getItem("theme");
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
        return "light";
      })();
      document.documentElement.classList.add(theme);
    </script>
  </head>
  <body>
    <ThemeProvider client:load>
      <div class="flex min-h-screen flex-col">
        <Header />
        <main class="flex-1">
          <slot />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  </body>
</html>
```

## 6. パフォーマンス最適化とベストプラクティス

### 6.1 クライアントディレクティブの適切な使用

- `client:load`: 即時読み込みが必要なコンポーネント（テーマ切り替えなど）
- `client:visible`: 画面に表示されたときにハイドレートするコンポーネント
- `client:idle`: ブラウザがアイドル状態になったときにハイドレート

### 6.2 画像最適化

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<div class="relative">
  <Image
    src={heroImage}
    alt="ヒーローイメージ"
    width={1200}
    height={600}
    class="rounded-lg object-cover"
    loading="eager"
  />
</div>
```

### 6.3 フォント最適化

```astro
---
// src/components/FontPreload.astro
---

<Fragment>
  <link rel="preconnect" href="https://rsms.me/" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  <link rel="preload" href="https://rsms.me/inter/font-files/Inter-roman.var.woff2" as="font" type="font/woff2" crossorigin />
</Fragment>
```

## 7. デプロイメント

### 7.1 Vercelへのデプロイ

```bash
vercel
```

### 7.2 Netlifyへのデプロイ

`netlify.toml`:

```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 8. トラブルシューティング

### 8.1 Hydration Mismatch

hydrationエラーが発生した場合、以下を確認：

1. コンポーネントがサーバーサイドとクライアントサイドで同じ出力をしているか
2. クライアントディレクティブが適切に設定されているか
3. `useEffect`を使用して初期レンダリングとクライアントレンダリングを区別しているか

### 8.2 パフォーマンス問題

1. 大きなコンポーネントは分割して必要なときだけロード
2. 画像の最適化
3. 適切なクライアントディレクティブの使用

## 9. 参考リソース

- [Astro公式ドキュメント](https://docs.astro.build/)
- [shadcn/ui公式サイト](https://ui.shadcn.com/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Astro + React統合ガイド](https://docs.astro.build/en/guides/integrations-guide/react/) 