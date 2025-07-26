// src/hooks/useLockBodyScroll.ts
import { useLayoutEffect } from "react";

export const useLockBodyScroll = (lock: boolean) => {
  useLayoutEffect(() => {
    if (lock) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [lock]);
};
