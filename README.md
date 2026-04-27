# QA Board - 極簡、優雅的即時問答展示平台

QA Board 是一個基於 Vue 3 與 Firebase 實作的即時問答系統。主持人可以發起題目，參與者透過手機即時回答，答案會以「蓋牌」形式動態出現在主持人螢幕上，最後由主持人一鍵翻牌揭曉。

![Aesthetics](https://img.shields.io/badge/Design-Premium%20Vanilla%20CSS-blueviolet)
![Framework](https://img.shields.io/badge/Framework-Vue%203-42b883)
![Backend](https://img.shields.io/badge/Backend-Firebase-ffca28)

## ✨ 特色功能

- **即時同步**：基於 Firebase Firestore，答案與房間狀態秒速同步。
- **Premium 視覺設計**：採用玻璃擬態 (Glassmorphism)、細緻陰影與現代字體。
- **3D 翻牌特效**：精緻的卡片翻轉動畫，營造揭曉答案時的期待感。
- **參與者追蹤**：主持人可即時查看在線人數與個別參與者的答題狀態。
- **響應式佈局**：完美支援桌機（主持人視角）與手機（參與者視角）。

## 🛠 技術架構

- **核心框架**：Vue 3 (Composition API)
- **建構工具**：Vite
- **路由管理**：Vue Router
- **後端服務**：Firebase Firestore (Real-time Database)
- **樣式處理**：Vanilla CSS (現代 CSS 變數、Flexbox/Grid 佈局)

## 🚀 本地啟動步驟

請確保你的環境已安裝 [Node.js](https://nodejs.org/) 以及 [pnpm](https://pnpm.io/)。

### 1. 複製專案與安裝依賴

```bash
# 安裝依賴套件
pnpm install
```

### 2. Firebase 與環境變數設定

專案使用環境變數管理 Firebase 配置，請在根目錄建立 `.env` 檔案：

1. 前往 [Firebase Console](https://console.firebase.google.com/) 建立新專案並啟用 Firestore。
2. 取得 Web App 的配置資訊。
3. 在專案根目錄建立 `.env` 檔案，格式如下：

```env
VITE_FIREBASE_API_KEY=你的_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=你的_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=你的_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=你的_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_SENDER_ID
VITE_FIREBASE_APP_ID=你的_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=你的_MEASUREMENT_ID
```

### 3. 啟動開發伺服器

```bash
pnpm dev
```

啟動後，瀏覽器開啟 `http://localhost:5173` 即可進入首頁。

## 📖 角色路徑說明

- **首頁 (`/`)**：建立或進入指定房間代碼。
- **主持人視角 (`/host/:roomId`)**：控制出題狀態、查看參與者名單、一鍵翻牌。
- **參與者加入 (`/join/:roomId`)**：輸入暱稱加入房間。
- **參與者視切 (`/room/:roomId`)**：輸入與修改答案，即時接收主持人出題狀態。

## 📦 部署

部署至 Firebase Hosting 前，請先安裝並登入 Firebase CLI：

### 1. 安裝 Firebase CLI
```bash
# 使用 pnpm 全域安裝
pnpm add -g firebase-tools

# 或使用 npm
npm install -g firebase-tools
```

### 2. 登入與初始化 (僅需一次)
```bash
# 登入 Google 帳號
firebase login

# 初始化專案 (若尚未初始化過)
firebase init
```

### 3. 編譯與部署
```bash
# 編譯專案
pnpm build

# 部署
firebase deploy
```
