/**
 * Wake Lock Composable
 * Manages screen wake lock to prevent the device from sleeping
 */

import { browser } from "$app/environment";
import { onMount } from "svelte";

export function useWakeLock() {
  let wakeLock = $state<WakeLockSentinel | null>(null);
  let isSupported = $state(false);
  let isActive = $state(false);
  let error = $state<string | null>(null);

  // Check if Wake Lock API is supported
  onMount(() => {
    if (browser && "wakeLock" in navigator) {
      isSupported = true;
    }
  });

  /**
   * Request a wake lock to keep the screen on
   */
  async function requestWakeLock() {
    if (!browser || !isSupported) {
      error = "Wake Lock API is not supported in this browser";
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request("screen");
      isActive = true;
      error = null;

      // Listen for wake lock release
      wakeLock.addEventListener("release", () => {
        isActive = false;
      });
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to acquire wake lock";
      isActive = false;
    }
  }

  /**
   * Release the wake lock
   */
  async function releaseWakeLock() {
    if (wakeLock) {
      try {
        await wakeLock.release();
        wakeLock = null;
        isActive = false;
        error = null;
      } catch (err) {
        error = err instanceof Error ? err.message : "Failed to release wake lock";
      }
    }
  }

  /**
   * Toggle wake lock on/off
   */
  async function toggle() {
    if (isActive) {
      await releaseWakeLock();
    } else {
      await requestWakeLock();
    }
  }

  // Re-acquire wake lock when page becomes visible again
  if (browser) {
    document.addEventListener("visibilitychange", async () => {
      if (wakeLock !== null && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    });
  }

  return {
    get isSupported() {
      return isSupported;
    },
    get isActive() {
      return isActive;
    },
    get error() {
      return error;
    },
    requestWakeLock,
    releaseWakeLock,
    toggle,
  };
}
