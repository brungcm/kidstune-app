import { generateHandler } from "../generate";
import { freeQuotaHandler } from "../free-quota";
import { Request, Response } from "express";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn(),
    }),
  })),
}));

// Mock firebase-admin for free-quota
jest.mock("firebase-admin", () => {
  const mockTimestamp = {
    now: jest.fn().mockReturnValue({
      toMillis: jest.fn().mockReturnValue(Date.now()),
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    }),
  };

  const mockDocRef = {
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
  };

  const mockCollection = jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue(mockDocRef),
  });

  const mockRunTransaction = jest.fn();

  return {
    initializeApp: jest.fn(),
    firestore: Object.assign(
      jest.fn().mockReturnValue({
        collection: mockCollection,
        runTransaction: mockRunTransaction,
        Timestamp: mockTimestamp,
      }),
      { Timestamp: mockTimestamp },
    ),
  };
});

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function createMockReq(overrides: Partial<Request> = {}): Request {
  return {
    method: "POST",
    body: {},
    headers: {},
    query: {},
    path: "/",
    url: "/",
    ip: "127.0.0.1",
    ...overrides,
  } as unknown as Request;
}

function createMockRes(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

// ---------------------------------------------------------------------------
// Test: Happy path — Gemini mocked returns lyrics
// ---------------------------------------------------------------------------

describe("POST /api/generate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  test("happy path — returns 200 with lyrics", async () => {
    const mockLyrics = `(Refrão)
Sorrir, sorrir, é tão bom sorrir,
Com o sol a brilhar, vamos todos cantar!

(Estrofe 1)
No jardim da alegria, a brincar,
Pássaros a voar, flor a desabrochar...`;

    // Setup Gemini mock to return lyrics
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: jest.fn().mockReturnValue(mockLyrics),
      },
    });
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    }));

    const req = createMockReq({
      body: {
        theme: "Alegria e amizade",
        kidName: "Luna",
        voice: "feminina",
        style: "pop",
        locale: "pt-BR",
      },
    });

    const res = createMockRes();
    await generateHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        lyrics: mockLyrics,
        audioUrl: null,
        lyricsLanguage: "pt-BR",
      }),
    );
  });

  test("returns 400 when theme is missing", async () => {
    const req = createMockReq({
      body: {
        style: "pop",
      },
    });
    const res = createMockRes();
    await generateHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "validation_error" }),
    );
  });

  test("returns 400 when style is missing", async () => {
    const req = createMockReq({
      body: {
        theme: "Amizade",
      },
    });
    const res = createMockRes();
    await generateHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "validation_error" }),
    );
  });

  test("returns 400 when kidName contains blocked keyword", async () => {
    const req = createMockReq({
      body: {
        theme: "Amizade",
        kidName: "violencia",
        style: "pop",
      },
    });
    const res = createMockRes();
    await generateHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "validation_error" }),
    );
  });

  test("returns 502 when Gemini fails", async () => {
    // Setup Gemini mock to throw
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const mockGenerateContent = jest.fn().mockRejectedValue(new Error("Gemini API error"));
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    }));

    const req = createMockReq({
      body: {
        theme: "Amizade",
        style: "pop",
        locale: "pt-BR",
      },
    });
    const res = createMockRes();
    await generateHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "generation_failed",
        userMessage: "Tivemos um problema gerando a música. Pode tentar de novo?",
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Test: Free quota
// ---------------------------------------------------------------------------

describe("POST /api/free-quota", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 429 when quota exhausted", async () => {
    const db = require("firebase-admin").firestore();

    // Simulate quota exhausted (count >= 2)
    db.runTransaction.mockImplementation(async (callback: any) => {
      const mockTransaction = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({
            count: 2,
            windowStartedAt: {
              toMillis: () => Date.now() - 1000, // 1 second ago
            },
          }),
        }),
        update: jest.fn(),
        set: jest.fn(),
      };

      await callback(mockTransaction);
    });

    const req = createMockReq({
      body: { ip: "192.168.1.1" },
    });
    const res = createMockRes();
    await freeQuotaHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "free_quota_exhausted" }),
    );
  });

  test("returns 200 with remaining count for new IP", async () => {
    const db = require("firebase-admin").firestore();

    db.runTransaction.mockImplementation(async (callback: any) => {
      const mockTransaction = {
        get: jest.fn().mockResolvedValue({
          exists: false,
        }),
        set: jest.fn(),
        update: jest.fn(),
      };

      await callback(mockTransaction);
    });

    const req = createMockReq({
      body: { ip: "10.0.0.1" },
    });
    const res = createMockRes();
    await freeQuotaHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ remaining: 1 }),
    );
  });
});
