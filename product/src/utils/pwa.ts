/**
 * Service worker registration and PWA install prompt handling.
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers are not supported in this browser");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    console.log("Service worker registered:", registration.scope);
    return registration;
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return null;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  // The 'beforeinstallprompt' event is fired on the window
  // We store it via a module-level variable
  return (window as any).__campus_compass_install_prompt ?? null;
}

export function setupInstallPrompt(): void {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    // Prevent the default mini-infobar
    e.preventDefault();
    // Store the event so we can trigger it later
    (window as any).__campus_compass_install_prompt = e;
  });

  window.addEventListener("appinstalled", () => {
    // Clear the stored prompt
    (window as any).__campus_compass_install_prompt = null;
    console.log("Campus Compass was installed");
  });
}