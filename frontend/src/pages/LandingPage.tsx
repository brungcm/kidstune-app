import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ThemeCard from "../components/ThemeCard";

const themes = [
  {
    emoji: "🐾",
    labelKey: "landing.theme.animals",
    color: "#FAB1A0",
  },
  {
    emoji: "✨",
    labelKey: "landing.theme.fantasy",
    color: "#6C5CE7",
  },
  {
    emoji: "🎂",
    labelKey: "landing.theme.birthday",
    color: "#FFD93D",
  },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-display font-bold text-h1 text-primary max-w-2xl">
          {t("landing.title")}
        </h1>

        <p className="font-body text-body text-gray-600 mt-4 max-w-lg">
          {t("landing.subtitle")}
        </p>

        <Button
          variant="primary"
          className="mt-8 text-lg px-10 py-4"
          onClick={() => navigate("/criar")}
        >
          {t("landing.cta")}
        </Button>
      </section>

      {/* Theme Preview Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.labelKey}
              emoji={theme.emoji}
              label={t(theme.labelKey)}
              color={theme.color}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
