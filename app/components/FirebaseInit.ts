"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "@/app/lib/firebaseAnalytics";

export default function FirebaseInit() {
  useEffect(() => {
    console.log("FirebaseInit mounted");
    void initializeFirebaseAnalytics();
  }, []);

  return null; // 画面には何も表示しない
}
