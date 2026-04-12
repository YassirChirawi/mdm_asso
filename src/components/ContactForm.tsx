"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Envoyez-nous un message</h3>

      {status === "success" && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-medium">
          Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
          Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input
            type="text"
            id="name"
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] outline-none transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
          <input
            type="email"
            id="email"
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] outline-none transition-colors"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
          <input
            type="text"
            id="subject"
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] outline-none transition-colors"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            required
            rows={5}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] outline-none transition-colors resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full flex items-center justify-center py-4 px-6 rounded-xl bg-brand-dark text-white font-bold text-lg hover:bg-[#1D9E75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
