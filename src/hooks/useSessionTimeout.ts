import { useEffect, useCallback, useRef } from "react";

const DEFAULT_TIMEOUT = 15 * 60 * 1000;

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
      logoutFn();
    }, timeoutDuration);
  }, [logoutFn, timeoutDuration]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    resetTimer();

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

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
