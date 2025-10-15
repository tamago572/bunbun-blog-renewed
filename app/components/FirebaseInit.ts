"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/firebaseAnalytics";

export default function FirebaseInit() {
  useEffect(() => {
    // Analyticsが使える環境なら自動で初期化済み
    console.log("FirebaseInit mounted");
  }, []);

  return null; // 画面には何も表示しない
}
