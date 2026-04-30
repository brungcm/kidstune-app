import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import CreatePage from "../pages/CreatePage";

function renderWithProviders() {
  return render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    </I18nextProvider>,
  );
}

describe("CreatePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the form title", () => {
    renderWithProviders();
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title.textContent).toBeTruthy();
  });

  it("renders all form fields (theme select, kid name, voice, style)", () => {
    renderWithProviders();

    // Theme select
    expect(screen.getByLabelText(/theme|tema/i)).toBeInTheDocument();

    // Kid name input
    expect(screen.getByLabelText(/kid's name|nome da criança/i)).toBeInTheDocument();

    // Voice select
    expect(screen.getByLabelText(/voice|voz/i)).toBeInTheDocument();

    // Style select
    expect(screen.getByLabelText(/style|estilo/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders();
    const submitBtn = screen.getByRole("button", { name: /generate song|gerar música/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it("shows custom keyword input when theme is Custom", () => {
    renderWithProviders();

    const themeSelect = screen.getByLabelText(/theme|tema/i);
    fireEvent.change(themeSelect, { target: { value: "custom" } });

    expect(screen.getByLabelText(/custom keyword|palavra-chave personalizada/i)).toBeInTheDocument();
  });

  it("disables submit button while submitting", async () => {
    // Mock fetch to never resolve during this test
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise(() => {}),
    );

    renderWithProviders();

    const submitBtn = screen.getByRole("button", { name: /generate song|gerar música/i });
    fireEvent.click(submitBtn);

    // After clicking, button should be disabled and show loading
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it("shows friendly message when backend returns 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    renderWithProviders();

    const submitBtn = screen.getByRole("button", { name: /generate song|gerar música/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/coming soon|volte em breve/i)).toBeInTheDocument();
    });
  });
});
