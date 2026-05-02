import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface GenerateRequest {
  theme: string;
  kidName?: string;
  voice: "feminina" | "masculina" | "instrumental";
  style: "lullaby" | "pop" | "folk";
  locale: "pt-BR" | "en-US";
}

interface GenerateResponse {
  audioUrl: string | null;
  lyrics: string;
  durationSec: number;
  lyricsLanguage: string;
}

// ---------------------------------------------------------------------------
// Content guardrails
// ---------------------------------------------------------------------------

const BLOCKED_KEYWORDS = [
  "violencia", "violência", "arma", "morte", "morrer", "matar",
  "violence", "weapon", "gun", "death", "die", "kill",
  "drogas", "drugs",
  "sexo", "sex",
  "terror", "terrorism",
];

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function containsBlockedKeyword(text: string): boolean {
  const lower = normalize(text);
  return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
}

function sanitizeKidName(name: string | undefined): string | null {
  if (!name || name.trim().length === 0) return null;

  // Trim and normalize
  let sanitized = name.trim();

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Cap at 30 chars
  sanitized = sanitized.slice(0, 30);

  // Block if contains risky keyword
  if (containsBlockedKeyword(sanitized)) {
    return null;
  }

  return sanitized;
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildPrompt(params: GenerateRequest): string {
  const { theme, kidName, voice, style, locale } = params;

  if (locale === "pt-BR") {
    const namePart = kidName
      ? `A música deve incluir o nome "${kidName}" de forma carinhosa ao longo da letra.`
      : "";

    const voiceDesc: Record<string, string> = {
      feminina: "voz feminina suave",
      masculina: "voz masculina calma",
      instrumental: "apenas instrumental, sem vocal",
    };

    const styleDesc: Record<string, string> = {
      lullaby: "uma canção de ninar calma, com ritmo suave e repetitivo",
      pop: "uma música pop animada e alegre",
      folk: "uma música folk com violão e melodia simples",
    };

    return `Você é um compositor infantil especializado em criar músicas para crianças.

Crie a letra de uma música infantil em português (pt-BR) com o tema: "${theme}".

Estilo: ${styleDesc[style] || styleDesc.lullaby}
Voz: ${voiceDesc[voice] || voiceDesc.feminina}
${namePart}

A letra deve:
- Ter entre 4 e 8 estrofes
- Ser apropriada para crianças de 2 a 8 anos
- Ter linguagem simples, alegre e educativa
- Incluir um refrão que se repete
- Ser fácil de cantar e memorizar

Retorne APENAS a letra da música, sem introduções, explicações ou formatação extra.`;
  }

  // English
  const namePart = kidName
    ? `The song should include the name "${kidName}" in a warm, affectionate way throughout the lyrics.`
    : "";

  const voiceDesc: Record<string, string> = {
    feminina: "soft female voice",
    masculina: "calm male voice",
    instrumental: "instrumental only, no vocals",
  };

  const styleDesc: Record<string, string> = {
    lullaby: "a calm lullaby with soft, repetitive rhythm",
    pop: "an upbeat, cheerful pop song",
    folk: "a folk song with acoustic guitar and simple melody",
  };

  return `You are a children's songwriter specialized in creating music for kids.

Write the lyrics for a children's song in English (en-US) with the theme: "${theme}".

Style: ${styleDesc[style] || styleDesc.lullaby}
Voice: ${voiceDesc[voice] || voiceDesc.feminina}
${namePart}

The lyrics should:
- Be 4 to 8 verses long
- Be appropriate for children ages 2-8
- Use simple, cheerful, and educational language
- Include a repeating chorus
- Be easy to sing and memorize

Return ONLY the song lyrics, no introductions, explanations, or extra formatting.`;
}

// ---------------------------------------------------------------------------
// Gemini call with retry
// ---------------------------------------------------------------------------

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const maxRetries = 1;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini");
      }

      return text.trim();
    } catch (err) {
      lastError = err as Error;
      const isRetryable =
        lastError.message.includes("timeout") ||
        lastError.message.includes("500") ||
        lastError.message.includes("503") ||
        lastError.message.includes("429") ||
        lastError.message.includes("RESOURCE_EXHAUSTED");

      if (isRetryable && attempt < maxRetries) {
        console.info("Gemini retry", {
          attempt: attempt + 1,
          maxRetries,
          error: lastError.message,
        });
        // Wait 1 second before retry
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error("Unknown Gemini error");
}

// ---------------------------------------------------------------------------
// Handler principal
// ---------------------------------------------------------------------------

export async function generateHandler(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();

  try {
    // Only POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed", userMessage: "Use POST." });
      return;
    }

    // Parse body
    const body = req.body as GenerateRequest;

    // Validate required fields
    if (!body.theme || typeof body.theme !== "string" || body.theme.trim().length === 0) {
      res.status(400).json({ error: "validation_error", userMessage: "O campo 'theme' é obrigatório." });
      return;
    }

    if (!body.style || !["lullaby", "pop", "folk"].includes(body.style)) {
      res.status(400).json({ error: "validation_error", userMessage: "O campo 'style' é obrigatório (lullaby, pop, folk)." });
      return;
    }

    // Sanitize
    const theme = body.theme.trim().slice(0, 200);
    const kidName = sanitizeKidName(body.kidName);
    const voice = body.voice || "feminina";
    const style = body.style;
    const locale = body.locale || "pt-BR";

    // Check if kidName was blocked
    if (body.kidName && body.kidName.trim().length > 0 && kidName === null) {
      res.status(400).json({
        error: "validation_error",
        userMessage: "O nome da criança contém conteúdo não permitido.",
      });
      return;
    }

    // Check theme for blocked keywords
    if (containsBlockedKeyword(theme)) {
      res.status(400).json({
        error: "validation_error",
        userMessage: "O tema contém conteúdo não permitido.",
      });
      return;
    }

    // Build prompt
    const prompt = buildPrompt({ theme, kidName: kidName ?? undefined, voice, style, locale });

    // Get API key from environment (injected by Firebase Secrets at runtime)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      res.status(500).json({ error: "config_error", userMessage: "Serviço de IA não configurado." });
      return;
    }

    // Call Gemini
    const lyrics = await callGemini(prompt, apiKey);

    const durationMs = Date.now() - startTime;

    // Structured logging
    console.info("generate_success", {
      tenantId: "anonymous",
      theme,
      locale,
      lyricsLength: lyrics.length,
      durationMs,
    });

    const response: GenerateResponse = {
      audioUrl: null, // null = use browser web speech
      lyrics,
      durationSec: Math.ceil(lyrics.length / 20), // rough estimate ~20 chars/sec
      lyricsLanguage: locale,
    };

    res.status(200).json(response);
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const error = err as Error;

    console.error("generate_error", {
      error: error.message,
      durationMs,
    });

    res.status(502).json({
      error: "generation_failed",
      userMessage: "Tivemos um problema gerando a música. Pode tentar de novo?",
    });
  }
}
