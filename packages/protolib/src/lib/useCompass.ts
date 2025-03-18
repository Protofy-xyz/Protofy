import { useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";

export type DeviceOrientationPermission = "granted" | "denied" | "default"

export type OrientationState = {
  degree: number,
  accuracy: number,
}

const useCompass = (interval: number = 20) => {
  const absolute = useRef<boolean>(false);
  const [state, setState] = useState<OrientationState | null>(null);

  const updateAlpha = useMemo(
    () =>
      throttle(
        (_state: OrientationState | null) => {
          setState(_state);
        },
        Math.max(5, interval)
      ),
    []
  );

  useEffect(() => {
    const el = (e: DeviceOrientationEvent) => {
      if (e.absolute) absolute.current = true;
      // @ts-ignore
      if (typeof e.webkitCompassHeading !== "undefined") {
        // @ts-ignore
        updateAlpha({degree: 360 - e.webkitCompassHeading, accuracy: e.webkitCompassAccuracy});
      } else if (e.absolute === absolute.current) {
        updateAlpha(e.alpha !== null ? {degree: e.alpha, accuracy: 0}: null);
      }
    };

    // @ts-ignore
    window.addEventListener("deviceorientationabsolute", el);
    window.addEventListener("deviceorientation", el);

    return () => {
      // @ts-ignore
      window.removeEventListener("deviceorientationabsolute", el);
      window.removeEventListener("deviceorientation", el);
    };
  }, []);

  return state;
};

export default useCompass;

export const requestPermission = (): Promise<DeviceOrientationPermission> => {
  const ret = Promise.resolve("granted" as DeviceOrientationPermission)
  // @ts-ignore
  if ( isSafari && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent?.requestPermission === "function" ) {
    // @ts-ignore
    return DeviceOrientationEvent.requestPermission()
  }
  return ret
}

export const isSafari: boolean = (() => {
  try {
    return Boolean(
      navigator &&
        navigator.userAgent &&
        navigator.userAgent.includes("Safari/") &&
        !(
          navigator.userAgent.includes("Chrome/") ||
          navigator.userAgent.includes("Chromium/")
        ),
    );
  } catch {
    return false;
  }
})()