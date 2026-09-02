"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useGuideProgress } from "@/lib/guideProgress";

/**
 * Marque le chapitre comme lu, automatiquement quand le lecteur atteint la fin,
 * ou à la main via le bouton. Placé en bas du chapitre.
 */
export default function ChapterProgress({ chapterId }: { chapterId: string }) {
  const { progress, markRead, toggle } = useGuideProgress();
  const sentinel = useRef<HTMLDivElement>(null);
  const isRead = Boolean(progress[chapterId]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || isRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          markRead(chapterId);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [chapterId, isRead, markRead]);

  return (
    <div ref={sentinel} className="mt-16">
      <button
        onClick={() => toggle(chapterId)}
        aria-pressed={isRead}
        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border font-heading font-black text-sm uppercase tracking-widest transition-colors ${
          isRead
            ? "bg-brand-green/10 border-brand-green/30 text-brand-green"
            : "bg-white border-gray-200 text-gray-500 hover:border-brand-green hover:text-brand-green"
        }`}
      >
        {isRead ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        {isRead ? "Chapitre lu" : "Marquer ce chapitre comme lu"}
      </button>
    </div>
  );
}
