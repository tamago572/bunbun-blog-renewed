"use client";

import { type Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { app } from "./firebase";

let analytics: Analytics | null = null;

export async function initializeFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const { hostname } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".localhost");

  if (isLocalHost) {
    console.log("Firebase Analytics skipped on local development host");
    return null;
  }

  try {
    const supported = await isSupported();

    if (!supported) {
      console.log("Firebase Analytics not supported in this browser");
      return null;
    }

    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
    return analytics;
  } catch (error) {
    console.error("Firebase Analytics initialization failed", error);
    return null;
  }
}

export { analytics };
