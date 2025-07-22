# 設計書

## 概要

日本語のローマ字入力のタイピングゲームを、React + TypeScript + Viteを使用して実装します。1ページなのでルーティングライブラリは不要です。

## アーキテクチャ

### 技術スタック（実装済み）

- **フロントエンド**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS
- **開発ツール**: ESLint + Prettier + TypeScript
- **ローマ字入力の判定処理:** [higgsino](https://github.com/Boson328/higgsino)

### 主要インターフェイス

日本語のプロパティ名は、適切に英語に翻訳してください。

```ts
/**
 * ワード
 */
type Word = {
  表示する文字列: string
  入力するひらがな: string
}

/**
 * タイピング練習記録
 */
type PracticeResult = {
  スコア: number,
  入力時間: number,
  入力文字数: number, // ローマ字の文字数
  ミス入力数: number, // ミスタイプの回数
  正確率: number, // 正しく入力した文字数の割合
  KPM: number, // 60秒間に入力した文字の数（keys per minutes）
  RKPM: number, // 初速を抜いたKPM
  初速: number, // ワードが表示されてから最初の正解の文字を入力するまでにかかった時間（平均値）
  ワード別の結果
}

/**
 * 各ワードの練習記録
 */
type WordResult = {
  word: Word,
  初速: number, // 同上
  KPM: number, // 同上
  RKPM: number, // 同上
  ミス入力数: number, // 同上
}
```
