import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Button from "../components/Button";

const PACKS = [
  { key: "starter", name: "Starter", price: "$4.99", credits: 5, color: "from-green-400 to-green-500" },
  { key: "popular", name: "Popular", price: "$12.99", credits: 15, color: "from-blue-400 to-blue-500" },
  { key: "family", name: "Family", price: "$34.99", credits: 50, color: "from-purple-400 to-purple-500" },
];

export default function ComprarPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy(pack: string) {
    if (!user) {
      setError("Você precisa estar logado para comprar.");
      return;
    }

    setBuying(pack);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack, uid: user.uid }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.userMessage || "Erro ao criar checkout.");
      }

      const data = await res.json();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
      setBuying(null);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-h1 text-primary text-center mb-4">
          {t("comprar.title") || "Comprar Créditos"}
        </h1>
        <p className="font-body text-body text-gray-500 text-center mb-8 max-w-md mx-auto">
          {t("comprar.subtitle") ||
            "Escolha um pacote de créditos para gerar mais músicas personalizadas."}
        </p>

        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-card font-body text-small text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {PACKS.map((pack) => (
            <div
              key={pack.key}
              className="bg-white rounded-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${pack.color} px-5 py-6 text-center`}
              >
                <h3 className="font-display font-bold text-h2 text-white">
                  {pack.name}
                </h3>
                <p className="font-display text-h1 text-white font-bold mt-2">
                  {pack.price}
                </p>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="text-center mb-6">
                  <span className="font-display text-h2 font-bold text-gray-800">
                    {pack.credits}
                  </span>
                  <span className="font-body text-body text-gray-500 ml-1">
                    créditos
                  </span>
                </div>

                <ul className="font-body text-small text-gray-600 space-y-2 mb-6">
                  <li>✓ {pack.credits} músicas geradas</li>
                  <li>✓ Letras personalizadas</li>
                  <li>✓ Nome da criança na música</li>
                  <li>✓ Válido por tempo ilimitado</li>
                </ul>

                <Button
                  variant="primary"
                  className="w-full"
                  disabled={buying === pack.key}
                  onClick={() => handleBuy(pack.key)}
                >
                  {buying === pack.key
                    ? (t("common.loading") || "Processando...")
                    : (t("comprar.buy") || "Comprar com Stripe (mock)")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Mock notice */}
        <p className="text-center mt-8 font-body text-small text-gray-400">
          💡 Modo mock ativo — nenhum pagamento real será processado.
        </p>
      </div>
    </div>
  );
}
