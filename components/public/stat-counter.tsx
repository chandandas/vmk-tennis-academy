"use client";

import { useEffect, useRef, useState } from "react";

type StatCounterProps = {
  value: number;
  label: string;
  suffix?: string;
};

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs]);

  return value;
}

export function StatCounter({ value, label, suffix = "+" }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const display = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-bold text-vmk-lime sm:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-sm font-medium text-white/75">{label}</p>
    </div>
  );
}
