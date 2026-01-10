import { useEffect, useCallback, useRef } from "react";

// Default timeout: 15 minutes (in milliseconds)
const DEFAULT_TIMEOUT = 15 * 60 * 1000;

/**
 * Hook to handle user session timeout due to inactivity.
 * @param logoutFn Function to call when timeout occurs.
 * @param timeoutDuration Duration in milliseconds before timeout (default: 15 mins).
 */
export const useSessionTimeout = (
  logoutFn: () => void,
  timeoutDuration: number = DEFAULT_TIMEOUT
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log("Session timed out due to inactivity.");
      logoutFn();
    }, timeoutDuration);
  }, [logoutFn, timeoutDuration]);

  useEffect(() => {
    // Events to listen for activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // Initial setup
    resetTimer();

    // Add event listeners
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);
};
