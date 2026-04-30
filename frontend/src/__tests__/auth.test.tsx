import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider, useAuth } from "../auth";

// Mock firebase modules
vi.mock("../firebase", () => ({
  auth: {
    onAuthStateChanged: vi.fn((_cb: any) => {
      // Simulate not logged in
      _cb(null);
      return vi.fn(); // unsubscribe
    }),
  },
  db: {},
  googleProvider: {},
}));

// Test component that uses useAuth
function TestComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <div>Logged in: {user.email}</div>;
  return <div>Not logged in</div>;
}

describe("useAuth", () => {
  it("renders not logged in state by default", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText("Not logged in")).toBeDefined();
  });

  it("renders loading state initially", () => {
    // Override mock to delay callback
    const { auth } = require("../firebase");
    auth.onAuthStateChanged = vi.fn(() => vi.fn());

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Should show loading since callback never fires
    expect(screen.getByText("Loading...")).toBeDefined();
  });
});
