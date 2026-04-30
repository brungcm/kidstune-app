import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-purple-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-purple-600">
          {t("app.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">Coming soon</p>
      </div>
    </main>
  );
}

export default App;
