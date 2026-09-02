"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "mdm-guide-progress";
const EVENT = "mdm-guide-progress-change";
const EMPTY = "{}";

export type GuideProgress = Record<string, string>;

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY;
  } catch {
    // Navigation privée ou stockage refusé : la lecture reste possible.
    return EMPTY;
  }
}

/** Un stockage corrompu ne doit jamais faire échouer un clic. */
function parse(raw: string): GuideProgress {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeRaw(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* pas de mémoire possible, ce n'est pas bloquant */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  // « storage » couvre les autres onglets, l'événement maison couvre celui-ci.
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * Progression de lecture du guide, conservée dans le navigateur du lecteur.
 *
 * Aucun compte n'est nécessaire et rien ne part sur le serveur : la progression
 * suit l'appareil, comme celle de la checklist. On passe par
 * useSyncExternalStore plutôt que par un effet, pour que le rendu serveur et le
 * premier rendu client partent tous deux d'une progression vide sans
 * déclencher de mise à jour d'état pendant le montage.
 */
export function useGuideProgress() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);

  const progress = useMemo(() => parse(raw), [raw]);

  const markRead = useCallback((chapterId: string) => {
    const current = parse(readRaw());
    if (current[chapterId]) return;
    writeRaw(JSON.stringify({ ...current, [chapterId]: new Date().toISOString() }));
  }, []);

  const toggle = useCallback((chapterId: string) => {
    const current = parse(readRaw());
    const next = { ...current };
    if (next[chapterId]) delete next[chapterId];
    else next[chapterId] = new Date().toISOString();
    writeRaw(JSON.stringify(next));
  }, []);

  const reset = useCallback(() => writeRaw(EMPTY), []);

  // Pas de drapeau « hydrated » : useSyncExternalStore sert la valeur du
  // serveur (progression vide) au premier rendu, puis la vraie juste apres.
  return { progress, markRead, toggle, reset };
}
