import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// 除錯提示：如果 API Key 為空，代表 .env 讀取失敗
if (!firebaseConfig.apiKey) {
  console.error("❌ Firebase API Key 讀取失敗！請確保專案根目錄有 .env 檔案，且變數以 VITE_ 開頭。");
  console.log("目前的環境變數物件：", import.meta.env);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
