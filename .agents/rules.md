# QA Board Project Rules & Context

Welcome, AI Agent. This project is a real-time Q&A platform built for live events.

## Tech Stack
- **Frontend**: Vue 3 (Composition API), Vite
- **Backend**: Firebase (Firestore)
- **Styling**: Vanilla CSS with a focus on premium aesthetics (Glassmorphism, Flexbox/Grid).
- **Package Manager**: pnpm

## Vue Component Architecture
遵循單一職責原則，避免大型元件（Monolithic components）。

1. **分層設計**：
   - **容器元件 (Container)**：負責與 Firebase 進行數據通信，管理狀態，不接受過多 Props。
   - **呈現元件 (Presentational)**：純粹處理 UI 與互動，透過 Props 接收數據，透過 Emit 發送事件。
2. **拆分時機**：
   - **重用性**：Button、Input、Card 等通用 UI 必須提取。
   - **複雜度**：當 `<template>` 超過 200 行或業務邏輯過於複雜時，優先將邏輯拆分為 **Composables (Hooks)**。
3. **SFC 規範**：每個檔案僅限一個 `<template>`，必須使用 `<script setup>` 並搭配 `<style scoped>`。

## Design Guidelines
- **Fonts**: Use 'Inter' and 'Noto Sans TC'.
- **Colors**: 
  - Primary: `#6366f1` (Indigo)
  - Success: `#10b981` (Emerald)
  - Danger: `#ef4444` (Red)
- **Components**: 
  - Use `.glass` class for translucent backgrounds.
  - Buttons should have smooth transitions and subtle hover lifts.
  - Cards should have rounded corners (`24px` to `32px`) and soft shadows.

## Common Workflows

### 1. Build & Verify
Always run a production build and verify the output before recommending a deployment.
```bash
pnpm build
```

### 2. Firebase Structure
- `rooms/{roomId}`: Main room state.
- `rooms/{roomId}/participants/{nickname}`: Participant presence.
- `rooms/{roomId}/answers/{nickname}`: Submitted answers.
- `questionSets/{setId}`: Predefined question sets.

## Agent Instructions
- ** casually causal**: Be expert but CASUAL in communication.
- **casually cassual**: Always prioritize visual excellence. If a UI component looks basic, improve it.
- **Precision**: When modifying Vue files, maintain the `<script setup>` and scoped CSS structure.
