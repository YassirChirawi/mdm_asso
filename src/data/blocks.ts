export type CalloutVariant = "attention" | "note" | "conseil" | "info";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; variant: CalloutVariant; text: string }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
  | { type: "letter"; title?: string; text: string };

export interface ChapterContent {
  title: string;
  blocks: Block[];
}

/** Titres retenus pour le sommaire d'un chapitre, avec leur ancre. */
export function buildToc(blocks: Block[]) {
  // Les chapitres bien découpés ont assez de h2 : au-delà de 3, on n'affiche
  // que ce niveau, sinon le sommaire devient plus long que le chapitre.
  const h2Count = blocks.filter((b) => b.type === "h2").length;
  const levels = h2Count >= 4 ? ["h2"] : ["h2", "h3"];

  return blocks.flatMap((block, index) =>
    levels.includes(block.type) && "text" in block
      ? [{ id: `section-${index}`, title: block.text, level: block.type as "h2" | "h3" }]
      : []
  );
}

/** Temps de lecture estimé, arrondi à la minute (230 mots/minute). */
export function readingTime(blocks: Block[]) {
  const words = blocks.reduce((total, block) => {
    let text: string;
    if (block.type === "ul") text = block.items.join(" ");
    else if (block.type === "table") text = [...block.headers, ...block.rows.flat()].join(" ");
    else text = block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 230));
}

/**
 * Date de la dernière vérification des informations administratives (montants,
 * démarches, délais). Affichée aux lecteurs : la valeur du guide tient à son
 * actualité, et les règles changent souvent en cours d'année.
 * Sources et détail des corrections : scripts/corrections.py.
 */
export const DERNIERE_VERIFICATION = "2 septembre 2026";
