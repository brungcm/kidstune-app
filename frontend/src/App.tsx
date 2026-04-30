import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import MinhasMusicasPage from "./pages/MinhasMusicasPage";
import ComprarPage from "./pages/ComprarPage";
import MockStripeCheckoutPage from "./pages/MockStripeCheckoutPage";
import Header from "./components/Header";
import LanguageFooter from "./components/LanguageFooter";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/criar" element={<CreatePage />} />
              <Route path="/minhas-musicas" element={<MinhasMusicasPage />} />
              <Route path="/comprar" element={<ComprarPage />} />
              <Route path="/mock-stripe-checkout" element={<MockStripeCheckoutPage />} />
            </Routes>
          </main>
          <LanguageFooter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
