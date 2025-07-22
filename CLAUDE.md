# CLAUDE.md

日本語で返答してください。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese typing game project built with React + TypeScript + Vite. The goal is to create a single-page application where users can practice typing Japanese text in romaji (Latin characters).

## Architecture

- **Tech Stack**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Development Tools**: ESLint + Prettier + TypeScript
- **Romaji Input Processing**: [higgsino](https://github.com/Boson328/higgsino) library for handling multiple valid romaji input patterns

## Key Domain Models

The application works with three representations of Japanese text:
- Kanji-mixed text (e.g., "夏の恋は冷めやすい")
- Hiragana (e.g., "なつのこいはさめやすい")
- Romaji (e.g., "natunokoihasameyasui")

Core types (translate Japanese property names to English):

```typescript
type Word = {
  表示する文字列: string // display text
  入力するひらがな: string // hiragana to type
}

type PracticeResult = {
  スコア: number // score
  入力時間: number // input time
  入力文字数: number // character count (romaji)
  ミス入力数: number // miss count
  正確率: number // accuracy rate
  KPM: number // keys per minute
  RKPM: number // real KPM (excluding initial delay)
  初速: number // initial speed (avg time to first correct char)
  ワード別の結果: WordResult[] // per-word results
}
```

## Game Flow

1. Start screen → Space key to begin
2. 3-second countdown
3. Display words sequentially for romaji input
4. Show results after completion
5. Retry button returns to start screen

## Content

Uses practice sentences from MyTyping's short sentence exercises about sleep/rest themes. All content is in Japanese with romaji input expected.

## Project Status

This appears to be a planning/documentation-only repository. The actual implementation (React components, build scripts, dependencies) has not been created yet.
