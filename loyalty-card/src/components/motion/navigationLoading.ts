export const NAVIGATION_START_EVENT = "third-hour:start-navigation";

/** Starts the shared loader before a programmatic App Router navigation. */
export function startNavigationLoader() {
  window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
}
