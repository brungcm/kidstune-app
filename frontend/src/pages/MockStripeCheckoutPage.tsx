import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

/**
 * Mock Stripe Checkout Page
 *
 * Renders a fake "Stripe" checkout UI, reads query params,
 * waits 2 seconds, then calls the mock webhook and redirects.
 */
export default function MockStripeCheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("");

  const sessionId = searchParams.get("session") || "";
  const credits = parseInt(searchParams.get("credits") || "0", 10);
  const pack = searchParams.get("pack") || "starter";

  useEffect(() => {
    if (!sessionId || credits <= 0) {
      setStatus("error");
      setMessage("Invalid checkout session.");
      return;
    }

    if (!user) {
      setStatus("error");
      setMessage("You must be logged in to complete checkout.");
      return;
    }

    let cancelled = false;

    async function processCheckout() {
      // Simulate 2s delay (Stripe UI feel)
      await new Promise((r) => setTimeout(r, 2000));

      if (cancelled) return;

      try {
        const res = await fetch("/api/webhook/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user?.uid,
            creditsAdded: credits,
            sessionId,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.userMessage || "Webhook failed");
        }

        const data = await res.json();

        if (cancelled) return;

        setStatus("success");
        setMessage(`✅ ${credits} créditos adicionados! Novo saldo: ${data.newBalance}`);

        // Redirect to /minhas-musicas after 1.5s
        setTimeout(() => {
          if (!cancelled) navigate("/minhas-musicas");
        }, 1500);
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Erro ao processar pagamento.",
        );
      }
    }

    processCheckout();

    return () => {
      cancelled = true;
    };
  }, [sessionId, credits, user, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-card shadow-md p-8 text-center">
        {/* Stripe-like header */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl">
              {status === "processing" ? "💳" : status === "success" ? "✅" : "❌"}
            </span>
          </div>
          <h1 className="font-display font-bold text-h2 text-gray-800">
            {status === "processing"
              ? "Processando pagamento..."
              : status === "success"
                ? "Pagamento confirmado!"
                : "Falha no pagamento"}
          </h1>
        </div>

        {/* Pack details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="font-body font-semibold text-body text-gray-700">
              Plano {pack.charAt(0).toUpperCase() + pack.slice(1)}
            </span>
            <span className="font-body font-bold text-body text-primary">
              {credits} créditos
            </span>
          </div>
          <div className="text-small text-gray-500">
            Session: {sessionId.slice(0, 12)}...
          </div>
        </div>

        {/* Status message */}
        {message && (
          <p className="font-body text-body text-gray-600 mb-4">{message}</p>
        )}

        {status === "processing" && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === "error" && (
          <button
            className="font-body text-small text-primary hover:underline mt-2"
            onClick={() => navigate("/comprar")}
          >
            ← Voltar para planos
          </button>
        )}
      </div>
    </div>
  );
}
