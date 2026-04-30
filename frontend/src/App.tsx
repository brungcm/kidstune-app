import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import LanguageFooter from "./components/LanguageFooter";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/criar" element={<CreatePage />} />
        </Routes>
        <LanguageFooter />
      </div>
    </BrowserRouter>
  );
}
