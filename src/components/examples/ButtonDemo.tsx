import React from "react";
import { Button } from "../ui/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-medium mb-3">バリアント</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">デフォルト</Button>
          <Button variant="destructive">破壊的</Button>
          <Button variant="outline">アウトライン</Button>
          <Button variant="secondary">セカンダリ</Button>
          <Button variant="ghost">ゴースト</Button>
          <Button variant="link">リンク</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">サイズ</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="default">デフォルト</Button>
          <Button size="sm">小</Button>
          <Button size="lg">大</Button>
          <Button size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Button>
        </div>
      </div>
    </div>
  );
} 