import { useTranslation } from "react-i18next";

export default function LanguageFooter() {
  const { t, i18n } = useTranslation();

  function handleLanguageChange(lng: string) {
    i18n.changeLanguage(lng);
  }

  return (
    <footer className="bg-background border-t border-gray-200 py-4 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
        <span className="font-body text-small text-gray-500">
          {t("common.language")}:
        </span>
        <button
          className={`font-body text-small px-3 py-1 rounded transition-colors ${
            i18n.language === "en-US"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-primary"
          }`}
          onClick={() => handleLanguageChange("en-US")}
        >
          EN-US
        </button>
        <button
          className={`font-body text-small px-3 py-1 rounded transition-colors ${
            i18n.language === "pt-BR"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-primary"
          }`}
          onClick={() => handleLanguageChange("pt-BR")}
        >
          PT-BR
        </button>
      </div>
    </footer>
  );
}
