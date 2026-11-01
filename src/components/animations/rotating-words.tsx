"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Signature animation 02 — rotating value proposition.
 * All phrases are stacked in one grid cell so the width never shifts.
 * Pauses on hover/focus, when the tab is hidden, and under reduced motion.
 */
export function RotatingWords({
  words,
  className,
  interval = 3400,
  activeIndex,
  onIndexChange,
}: {
  words: string[];
  className?: string;
  interval?: number;
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
}) {
  const [internalIdx, setInternalIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const i = activeIndex !== undefined ? activeIndex : internalIdx;

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      const next = (i + 1) % words.length;
      if (onIndexChange) {
        onIndexChange(next);
      } else {
        setInternalIdx(next);
      }
    }, interval);
    return () => clearInterval(id);
  }, [paused, reduce, interval, words.length, i, onIndexChange]);

  return (
    <span
      className="relative inline-grid overflow-hidden py-2.5 -my-2 align-bottom leading-[1.28]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      {/* sizing ghosts */}
      {words.map((w) => (
        <span key={w} className="invisible col-start-1 row-start-1 py-1.5 leading-[1.28]" aria-hidden>
          {w}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className={cn("col-start-1 row-start-1 py-1.5 leading-[1.28]", className)}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
