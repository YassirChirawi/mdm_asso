"use client";

import { useCallback, useEffect, useState } from "react";
import { MessagesSquare, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Comment {
  id: string;
  prenom: string;
  message: string;
  createdAt: string;
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function ChapterComments({ chapterId }: { chapterId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ prenom: "", email: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/guide/comments?chapterId=${chapterId}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      // Un échec de chargement ne doit pas casser la lecture du chapitre.
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/guide/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, chapterId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Envoi impossible pour le moment.");
        return;
      }
      setSent(true);
      setForm({ prenom: "", email: "", message: "", website: "" });
    } catch {
      setError("Envoi impossible pour le moment.");
    } finally {
      setSending(false);
    }
  };

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  return (
    <section
      id="echanges"
      aria-labelledby="echanges-titre"
      className="mt-20 pt-14 border-t border-gray-200 scroll-mt-28 md:scroll-mt-32"
    >
      <div className="flex items-center gap-3 md:gap-4 mb-3">
        <span className="bg-brand-green/10 text-brand-green p-2.5 rounded-2xl shrink-0">
          <MessagesSquare className="w-6 h-6" />
        </span>
        <h2 id="echanges-titre" className="font-heading text-2xl md:text-3xl font-black text-brand-dark">
          Échanges sur ce chapitre
        </h2>
      </div>
      <p className="text-gray-500 mb-10 leading-relaxed">
        Une question, une précision, ton propre retour d&apos;expérience ? Écris-le ici. Les
        messages sont relus par l&apos;association avant publication.
      </p>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 mb-10">
          <Loader2 className="w-5 h-5 animate-spin" />
          Chargement des échanges...
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4 mb-12">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                <span className="font-heading font-black text-brand-dark">{comment.prenom}</span>
                <span className="text-xs text-gray-400">
                  {dateFormat.format(new Date(comment.createdAt))}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                {comment.message}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 mb-12 italic">
          Aucun échange pour l&apos;instant. Lance la discussion.
        </p>
      )}

      {sent ? (
        <div className="flex items-start gap-4 bg-brand-green/5 border border-brand-green/20 rounded-2xl p-6">
          <CheckCircle2 className="w-6 h-6 text-brand-green shrink-0" />
          <div>
            <p className="font-heading font-black text-brand-dark mb-1">Message bien reçu</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Il sera publié après relecture par l&apos;association.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="comment-prenom"
                className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5"
              >
                Prénom <span className="text-brand-red">*</span>
              </label>
              <input
                id="comment-prenom"
                name="prenom"
                value={form.prenom}
                onChange={change}
                required
                maxLength={40}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="comment-email"
                className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5"
              >
                E-mail (facultatif, jamais publié)
              </label>
              <input
                id="comment-email"
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
              />
            </div>
          </div>

          <label
            htmlFor="comment-message"
            className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5"
          >
            Ton message <span className="text-brand-red">*</span>
          </label>
          <textarea
            id="comment-message"
            name="message"
            value={form.message}
            onChange={change}
            required
            rows={4}
            maxLength={2000}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-y"
          />

          {/* Champ piège anti-robot : masqué visuellement et ignoré des lecteurs d'écran. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="comment-website">Ne pas remplir</label>
            <input
              id="comment-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={change}
            />
          </div>

          {error && (
            <p className="mt-4 flex items-center gap-2 text-sm text-brand-red font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex items-center gap-2 bg-brand-green text-white font-black text-sm uppercase tracking-widest px-7 py-3.5 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Envoi..." : "Publier mon message"}
          </button>
        </form>
      )}
    </section>
  );
}
