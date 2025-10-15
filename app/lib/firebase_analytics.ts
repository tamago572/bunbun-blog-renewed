"use client";

import { type Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { app } from "./firebase";

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized");
    } else {
      console.log("Firebase Analytics not supported in this browser");
    }
  });
}

export { analytics };
