import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import LandingPage from "../pages/LandingPage";
import LanguageFooter from "../components/LanguageFooter";

function renderApp() {
  return render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <LandingPage />
        <LanguageFooter />
      </BrowserRouter>
    </I18nextProvider>,
  );
}

describe("i18n language switching", () => {
  it("renders English by default", () => {
    i18n.changeLanguage("en-US");
    renderApp();

    // The CTA should be in English
    const cta = screen.getByRole("button", { name: /create a song/i });
    expect(cta).toBeInTheDocument();
  });

  it("switches to Portuguese when PT-BR is clicked", () => {
    i18n.changeLanguage("en-US");
    renderApp();

    // Click PT-BR button
    const ptBrBtn = screen.getByRole("button", { name: /pt-br/i });
    fireEvent.click(ptBrBtn);

    // After switching, the CTA should be in Portuguese
    const cta = screen.getByRole("button", { name: /criar uma música/i });
    expect(cta).toBeInTheDocument();
  });

  it("switches back to English when EN-US is clicked", () => {
    i18n.changeLanguage("pt-BR");
    renderApp();

    // Click EN-US button
    const enUsBtn = screen.getByRole("button", { name: /en-us/i });
    fireEvent.click(enUsBtn);

    // After switching back, the CTA should be in English
    const cta = screen.getByRole("button", { name: /create a song/i });
    expect(cta).toBeInTheDocument();
  });
});
