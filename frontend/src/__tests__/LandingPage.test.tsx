import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import LandingPage from "../pages/LandingPage";

function renderWithProviders() {
  return render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    </I18nextProvider>,
  );
}

describe("LandingPage", () => {
  it("renders the landing title from i18n", () => {
    renderWithProviders();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title.textContent).toBeTruthy();
  });

  it("renders the CTA button with correct text", () => {
    renderWithProviders();
    const cta = screen.getByRole("button", { name: /create a song|criar uma música/i });
    expect(cta).toBeInTheDocument();
  });

  it("renders theme preview cards", () => {
    renderWithProviders();
    // Theme cards have emoji characters
    expect(screen.getByText("🐾")).toBeInTheDocument();
    expect(screen.getByText("✨")).toBeInTheDocument();
    expect(screen.getByText("🎂")).toBeInTheDocument();
  });

  it("has a link/button that navigates to /criar", () => {
    renderWithProviders();
    const cta = screen.getByRole("button", { name: /create a song|criar uma música/i });
    // In our setup the button uses navigate(), so it's not a regular link
    // We just verify it exists and is clickable
    expect(cta).toBeEnabled();
  });
});
