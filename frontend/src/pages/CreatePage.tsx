import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Select from "../components/Select";

interface FormData {
  theme: string;
  customKeyword: string;
  kidName: string;
  voice: string;
  style: string;
}

export default function CreatePage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({
    theme: "",
    customKeyword: "",
    kidName: "",
    voice: "",
    style: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const themeOptions = [
    { value: "animals", label: t("themeOption.animals") },
    { value: "fantasy", label: t("themeOption.fantasy") },
    { value: "butterflies", label: t("themeOption.butterflies") },
    { value: "adventure", label: t("themeOption.adventure") },
    { value: "bedtime", label: t("themeOption.bedtime") },
    { value: "custom", label: t("themeOption.custom") },
  ];

  const voiceOptions = [
    { value: "feminine", label: t("voice.feminine") },
    { value: "masculine", label: t("voice.masculine") },
    { value: "instrumental", label: t("voice.instrumental") },
  ];

  const styleOptions = [
    { value: "lullaby", label: t("style.lullaby") },
    { value: "pop", label: t("style.pop") },
    { value: "folk", label: t("style.folk") },
  ];

  function handleChange(
    field: keyof FormData,
    value: string,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      theme: form.theme === "custom" ? form.customKeyword : form.theme,
      kidName: form.kidName,
      voice: form.voice,
      style: form.style,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Backend route not available yet (Epic 4)
        setMessage(t("criar.comingSoon"));
      }
    } catch {
      // fetch throws on network error — also show friendly message
      setMessage(t("criar.comingSoon"));
    } finally {
      setSubmitting(false);
    }
  }

  const isCustom = form.theme === "custom";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="font-display font-bold text-h1 text-primary text-center mb-8">
          {t("criar.title")}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-white p-6 sm:p-8 rounded-card shadow-sm"
        >
          {/* Theme dropdown */}
          <Select
            label={t("criar.form.theme.label")}
            placeholder={t("criar.form.theme.placeholder")}
            options={themeOptions}
            value={form.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
          />

          {/* Custom keyword input — only when 'custom' is selected */}
          {isCustom && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="custom-keyword"
                className="font-body font-semibold text-small text-gray-700"
              >
                {t("criar.customKeyword")}
              </label>
              <input
                id="custom-keyword"
                type="text"
                className="font-body text-body px-4 py-3 rounded-input border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                value={form.customKeyword}
                onChange={(e) =>
                  handleChange("customKeyword", e.target.value)
                }
                placeholder="Ex: Dinossauros"
              />
            </div>
          )}

          {/* Kid name input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="kid-name"
              className="font-body font-semibold text-small text-gray-700"
            >
              {t("criar.form.kidName.label")}
            </label>
            <input
              id="kid-name"
              type="text"
              className="font-body text-body px-4 py-3 rounded-input border-2 border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              value={form.kidName}
              onChange={(e) => handleChange("kidName", e.target.value)}
              placeholder={t("criar.form.kidName.placeholder")}
            />
          </div>

          {/* Voice dropdown */}
          <Select
            label={t("criar.form.voice.label")}
            placeholder={t("criar.form.voice.placeholder")}
            options={voiceOptions}
            value={form.voice}
            onChange={(e) => handleChange("voice", e.target.value)}
          />

          {/* Style dropdown */}
          <Select
            label={t("criar.form.style.label")}
            placeholder={t("criar.form.style.placeholder")}
            options={styleOptions}
            value={form.style}
            onChange={(e) => handleChange("style", e.target.value)}
          />

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? t("common.loading") : t("criar.submit")}
          </Button>
        </form>

        {/* Status message */}
        {submitting && (
          <p className="font-body text-body text-primary text-center mt-6 animate-pulse">
            {t("criar.generating", {
              name: form.kidName || t("criar.title"),
            })}
          </p>
        )}

        {message && (
          <p className="font-body text-body text-gray-600 text-center mt-6 bg-secondary/30 p-4 rounded-card">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
