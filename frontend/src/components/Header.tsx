import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useCredits } from "../useCredits";
import Button from "./Button";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signIn, signOut, loading } = useAuth();
  const { credits } = useCredits(user?.uid);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo / Home */}
        <Link
          to="/"
          className="font-display font-bold text-h3 text-primary hover:opacity-80 transition-opacity"
        >
          🎵 {t("app.title")}
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            to="/criar"
            className="font-body text-body text-gray-600 hover:text-primary transition-colors"
          >
            {t("landing.cta")}
          </Link>

          {user ? (
            <>
              <Link
                to="/minhas-musicas"
                className="font-body text-body text-gray-600 hover:text-primary transition-colors"
              >
                {t("minhasMusicas.title") || "Minhas Músicas"}
              </Link>

              <Link
                to="/comprar"
                className="font-body text-body text-gray-600 hover:text-primary transition-colors"
              >
                {t("comprar.title") || "Comprar Créditos"}
              </Link>

              {/* Credits badge */}
              <span className="font-body text-small bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                ⭐ {credits}
              </span>

              {/* User avatar */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-body text-small">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              )}

              <Button variant="secondary" onClick={signOut} className="text-small px-3 py-1.5">
                {t("auth.signOut") || "Sair"}
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={signIn}
              disabled={loading}
              className="text-small px-4 py-1.5"
            >
              {loading ? (t("common.loading") || "Loading...") : (t("auth.signIn") || "Login Google")}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
