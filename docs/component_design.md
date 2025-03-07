---
title: "shadcnコンポーネント詳細設計"
description: "Astroプロジェクトで使用するshadcnコンポーネントの詳細設計と実装指針"
version: "1.0.0"
lastUpdated: "2024-06-04"
author: "開発チーム"
---

# shadcnコンポーネント詳細設計

このドキュメントでは、本プロジェクトで実装するshadcnコンポーネントの詳細設計と使用方法について解説します。

## 1. コンポーネント一覧と優先度

### 1.1 高優先度コンポーネント

| コンポーネント名 | 用途 | 特記事項 |
|--------------|------|--------|
| Button | アクション実行 | 全バリアント実装 |
| Card | 情報のグルーピング | 特徴紹介で使用 |
| Navigation | サイトナビゲーション | モバイル対応 |
| ThemeSwitch | ダーク/ライトモード切替 | 設定の永続化 |
| Header/Footer | レイアウト構造 | 全ページ共通 |

### 1.2 中優先度コンポーネント

| コンポーネント名 | 用途 | 特記事項 |
|--------------|------|--------|
| Dialog | モーダルウィンドウ | 情報表示・確認 |
| Dropdown | 複数選択肢の表示 | ナビゲーション等 |
| Tabs | コンテンツの切り替え | コンポーネント例表示 |
| Form controls | フォーム入力 | バリデーション連携 |
| Alert | 通知表示 | 状態フィードバック |

### 1.3 低優先度コンポーネント

| コンポーネント名 | 用途 | 特記事項 |
|--------------|------|--------|
| Calendar | 日付選択 | 必要時のみ |
| Carousel | コンテンツスライド | 必要時のみ |
| Toast | 一時的通知 | 成功/エラー通知 |
| Skeleton | ローディング表示 | 遅延コンテンツ用 |

## 2. コアコンポーネント設計

### 2.1 Button

Buttonコンポーネントは最も基本的なアクションコンポーネントであり、様々なバリエーションを実装します。

#### 設計仕様

```tsx
// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 使用例

```tsx
import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>デフォルト</Button>
      <Button variant="secondary">セカンダリ</Button>
      <Button variant="destructive">削除</Button>
      <Button variant="outline">アウトライン</Button>
      <Button variant="ghost">ゴースト</Button>
      <Button variant="link">リンク</Button>
    </div>
  )
}
```

### 2.2 Card

情報をグループ化して表示するためのコンポーネント。特徴紹介やコンテンツの整理に使用します。

#### 設計仕様

```tsx
// src/components/ui/card.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

#### 使用例

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Astroの特徴</CardTitle>
        <CardDescription>
          Astroフレームワークの主要な特徴について
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Astroはパフォーマンスを最優先したフレームワークで、必要なJavaScriptだけをクライアントに送信します。</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">キャンセル</Button>
        <Button>詳細を見る</Button>
      </CardFooter>
    </Card>
  )
}
```

### 2.3 ThemeProvider

ダークモード/ライトモードの切り替えを管理するコンポーネント。ユーザー設定を永続化します。

#### 設計仕様

```tsx
// src/components/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
```

## 3. フォームコンポーネント設計

### 3.1 Input

```tsx
// src/components/ui/input.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### 3.2 Form

フォームコンポーネントは、React Hook Formと統合して使用します。

```tsx
// src/components/ui/form.tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

### 3.3 カスタムフォーム実装例

```tsx
// src/components/examples/ContactForm.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "名前は2文字以上で入力してください。",
  }),
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  message: z.string().min(10, {
    message: "メッセージは10文字以上で入力してください。",
  }),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "お問い合わせを受け付けました",
      description: "担当者からの連絡をお待ちください。",
    })
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>お名前</FormLabel>
              <FormControl>
                <Input placeholder="山田 太郎" {...field} />
              </FormControl>
              <FormDescription>
                あなたのフルネームを入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormDescription>
                連絡先のメールアドレスを入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メッセージ</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="お問い合わせ内容を記入してください"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                お問い合わせ内容を詳しく記入してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">送信する</Button>
      </form>
    </Form>
  )
}
```

## 4. カスタムコンポーネント設計

プロジェクト固有のコンポーネントも、shadcnのパターンに従って設計します。

### 4.1 FeatureCard

特徴紹介ページで使用する機能カードコンポーネント:

```tsx
// src/components/custom/feature-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader>
        <div className="mb-2 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
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

### 4.2 ComponentPreview

コンポーネントショーケースで使用するプレビューコンポーネント:

```tsx
// src/components/custom/component-preview.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
  title: string;
  description?: string;
  component: React.ReactNode;
  code: string;
  className?: string;
}

export function ComponentPreview({ 
  title, 
  description, 
  component, 
  code, 
  className 
}: ComponentPreviewProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
            <TabsTrigger value="code">コード</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="p-4 border rounded-md">
            {component}
          </TabsContent>
          <TabsContent value="code">
            <pre className="p-4 rounded-md bg-muted overflow-x-auto">
              <code>{code}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

## 5. レスポンシブデザイン

すべてのコンポーネントは、モバイルファーストのアプローチで設計します。

### 5.1 レスポンシブ対応ガイドライン

1. **基本原則**
   - モバイルファースト: 小さい画面サイズから設計
   - 流動的レイアウト: 固定幅を避け、パーセンテージや`rem`単位を使用
   - メディアクエリの適切な使用

2. **Tailwindブレイクポイント**
   - `sm`: 640px以上
   - `md`: 768px以上 
   - `lg`: 1024px以上
   - `xl`: 1280px以上
   - `2xl`: 1536px以上

### 5.2 レスポンシブコンポーネント例

```tsx
// src/components/custom/responsive-grid.tsx
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
```

## 6. アクセシビリティ対応

すべてのコンポーネントは、アクセシビリティに配慮して設計します。

### 6.1 アクセシビリティ対応ガイドライン

1. **適切なセマンティクスHTML**
   - 見出しの適切な階層構造
   - ランドマークの使用（main, nav, aside, footer）
   - ボタンとリンクの正しい使い分け

2. **ARIA属性の正しい使用**
   - `aria-label`, `aria-labelledby`, `aria-describedby`
   - `aria-expanded`, `aria-controls`
   - `aria-hidden`

3. **フォーカス管理**
   - タブナビゲーション対応
   - フォーカス可視性の確保
   - モーダルでのフォーカストラップ

### 6.2 アクセシブルコンポーネント例

```tsx
// src/components/custom/accessible-dropdown.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface AccessibleDropdownProps {
  label: string;
  items: { label: string; onClick: () => void }[];
  description?: string;
}

export function AccessibleDropdown({ label, items, description }: AccessibleDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label={description || label}>
          {label} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            onSelect={(e) => e.preventDefault()}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## 7. テーマカスタマイズ

### 7.1 カラーパレットのカスタマイズ

`src/styles/global.css`にあるCSS変数を調整して、テーマカラーをカスタマイズします。

```css
@layer base {
  :root {
    --primary: 173 80% 40%;
    --primary-foreground: 210 40% 98%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;

    --accent: 38 92% 50%;
    --accent-foreground: 210 40% 98%;
    
    /* その他の変数 */
  }
}
```

### 7.2 コンポーネントのバリエーション追加

既存のコンポーネントにカスタムバリエーションを追加する例:

```tsx
// src/components/ui/button.tsx の変更例
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // カスタム追加
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        subtle: "bg-muted hover:bg-muted/80 text-foreground",
      },
      // 他のバリエーション
    },
  }
)
```

## 8. パフォーマンス最適化

### 8.1 コンポーネントの最適化

1. **メモ化**
   - 複雑なコンポーネントには`React.memo`を使用
   - 計算コストの高い関数には`useMemo`を使用
   - イベントハンドラには`useCallback`を使用

2. **レンダリング最適化**
   - 不要な再レンダリングを避ける
   - 大きなリストには仮想化を検討

### 8.2 最適化例

```tsx
// src/components/optimized/optimized-list.tsx
import { useMemo, useCallback } from "react";

interface OptimizedListProps {
  items: string[];
  onItemClick: (item: string) => void;
}

export function OptimizedList({ items, onItemClick }: OptimizedListProps) {
  // 関数をメモ化
  const handleItemClick = useCallback((item: string) => {
    onItemClick(item);
  }, [onItemClick]);

  // 計算をメモ化
  const sortedItems = useMemo(() => {
    return [...items].sort();
  }, [items]);

  return (
    <ul className="space-y-2">
      {sortedItems.map((item, index) => (
        <li 
          key={index}
          onClick={() => handleItemClick(item)}
          className="p-2 hover:bg-muted cursor-pointer rounded"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

## 9. コンポーネントのテスト戦略

### 9.1 テスト方針

1. **ユニットテスト**
   - 個々のコンポーネントの機能テスト
   - プロップスの検証
   - イベントハンドリングの検証

2. **インテグレーションテスト**
   - 複数コンポーネントの連携テスト
   - フォーム送信などの複雑な操作

3. **ビジュアルリグレッションテスト**
   - コンポーネントの外観変更検出

### 9.2 テスト例

```tsx
// src/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });
});
```

## 10. コンポーネントドキュメンテーション

### 10.1 ドキュメント方針

各コンポーネントには、以下を含むドキュメントを提供します：

1. コンポーネントの目的と使用場面
2. プロップスの説明
3. バリエーションと例
4. アクセシビリティ考慮事項
5. 関連コンポーネント

### 10.2 ドキュメント例

```tsx
/**
 * Button コンポーネント
 * 
 * ユーザーアクションを実行するための主要なインタラクティブ要素です。
 * さまざまなスタイルバリエーションとサイズオプションを提供します。
 * 
 * @example
 * ```tsx
 * <Button variant="default">Click me</Button>
 * <Button variant="destructive">Delete</Button>
 * <Button size="sm">Small Button</Button>
 * ```
 * 
 * @accessibility
 * - キーボードフォーカス可能
 * - 高コントラスト比で視認性確保
 * - aria-disabled を適切に設定
 * 
 * @see Card - よく一緒に使用されるコンポーネント
 * @see Dialog - アクションの確認に使用
 */
``` 