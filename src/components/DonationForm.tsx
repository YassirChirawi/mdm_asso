"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

export default function DonationForm() {
  const [amount, setAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [5, 10, 20, 50];

  const handleDonate = async () => {
    const finalAmount = amount === null ? parseInt(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) return;

    setLoading(true);
    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Une erreur est survenue lors de la création de la session de paiement.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Choisissez le montant de votre soutien</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {predefinedAmounts.map((val) => (
          <button
            key={val}
            onClick={() => {
              setAmount(val);
              setCustomAmount("");
            }}
            className={`py-4 rounded-xl font-bold text-lg transition-all border-2 ${
              amount === val
                ? "border-[#C1272D] bg-[#C1272D]/10 text-[#C1272D]"
                : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
            }`}
          >
            {val} €
          </button>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ou saisissez un montant libre</label>
        <div className="relative">
          <input
            type="number"
            min="1"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(null);
            }}
            className={`w-full p-4 rounded-xl border-2 transition-all outline-none font-bold text-lg ${
              amount === null && customAmount
                ? "border-[#C1272D] bg-[#C1272D]/5"
                : "border-gray-100 bg-gray-50 focus:border-gray-300"
            }`}
            placeholder="Montant"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-500 font-bold text-xl">€</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDonate}
        disabled={loading || (!amount && !customAmount) || parseInt(customAmount) < 1}
        className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-[#C1272D] text-white font-bold text-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Heart className="w-5 h-5 mr-2" />
            Faire un don
          </>
        )}
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-4">
        Paiement 100% sécurisé via Stripe. En tant qu'association loi 1901, votre don peut ne pas ouvrir droit à une réduction d'impôt selon notre éligibilité fiscale.
      </p>
    </div>
  );
}
