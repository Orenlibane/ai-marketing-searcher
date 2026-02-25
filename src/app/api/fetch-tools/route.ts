import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";

interface ExaResult {
  title: string;
  url: string;
  text: string;
  publishedDate?: string;
}

interface ExaSearchResponse {
  results: ExaResult[];
}

interface ParsedTool {
  name: string;
  description: string;
  category: "SEO" | "Content" | "Social" | "Analytics" | "Email" | "Ads" | "Video" | "Design";
  sourceUrl: string;
  usageScore: number;
  reviewSentiment: "positive" | "neutral" | "negative";
}

async function searchExa(query: string): Promise<ExaResult[]> {
  const EXA_API_KEY = process.env.EXA_API_KEY;
  if (!EXA_API_KEY) {
    throw new Error("EXA_API_KEY is not configured");
  }

  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": EXA_API_KEY,
    },
    body: JSON.stringify({
      query,
      numResults: 20,
      type: "neural",
      useAutoprompt: true,
      contents: {
        text: { maxCharacters: 2000 },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Exa API error: ${response.status} - ${err}`);
  }

  const data = (await response.json()) as ExaSearchResponse;
  return data.results || [];
}

async function parseToolsWithClaude(results: ExaResult[]): Promise<ParsedTool[]> {
  const resultsText = results
    .map((r, i) => `[${i + 1}] Title: ${r.title}\nURL: ${r.url}\nContent: ${r.text}`)
    .join("\n\n---\n\n");

  const prompt = `Given these search results about AI marketing tools, extract each distinct tool mentioned.

For each tool return JSON: { name, description, category (SEO|Content|Social|Analytics|Email|Ads|Video|Design), sourceUrl, usageScore (0-100 based on mentions/sentiment), reviewSentiment (positive|neutral|negative) }

Only return tools that are specifically AI-powered marketing tools. Return a JSON array only, no other text.

Search results:
${resultsText}`;

  // Retry up to 3 times for transient errors (529 overloaded, 529, 529)
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
    try {
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const content = message.content[0];
      if (content.type !== "text") return [];

      const text = content.text.trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const parsed = JSON.parse(jsonMatch[0]) as ParsedTool[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      lastError = err as Error;
      const status = (err as { status?: number }).status;
      if (status === 529 || status === 429) {
        console.warn(`Claude attempt ${attempt + 1} failed (${status}), retrying...`);
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error("Claude parsing failed after retries");
}

function normalizeToolName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function POST() {
  try {
    const EXA_API_KEY = process.env.EXA_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!EXA_API_KEY || !ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error: "Missing API keys. Please configure EXA_API_KEY and ANTHROPIC_API_KEY in your .env.local file.",
        },
        { status: 400 }
      );
    }

    // Fetch current tool names from DB for deduplication
    const existingTools = await prisma.marketingTool.findMany({
      select: { id: true, name: true, usageScore: true },
    });
    const existingNormalized = new Map(
      existingTools.map((t) => [normalizeToolName(t.name), t])
    );

    // Search for new AI marketing tools
    const queries = [
      "new AI marketing tool launch 2025 site:producthunt.com",
      "AI marketing software launch 2025 site:techcrunch.com",
      "best new AI tools for marketers 2025",
    ];

    let allResults: ExaResult[] = [];
    for (const query of queries) {
      try {
        const results = await searchExa(query);
        allResults = [...allResults, ...results];
      } catch (err) {
        console.error(`Search failed for query "${query}":`, err);
      }
    }

    if (allResults.length === 0) {
      return NextResponse.json({ error: "No search results found" }, { status: 500 });
    }

    // Parse tools with Claude
    const parsedTools = await parseToolsWithClaude(allResults);

    let added = 0;
    let updated = 0;
    const addedNames: string[] = [];
    const updatedNames: string[] = [];

    for (const tool of parsedTools) {
      if (!tool.name || !tool.description || !tool.category || !tool.sourceUrl) continue;

      const normalized = normalizeToolName(tool.name);
      const existing = existingNormalized.get(normalized);

      // Validate category
      const validCategories = ["SEO", "Content", "Social", "Analytics", "Email", "Ads", "Video", "Design"];
      if (!validCategories.includes(tool.category)) continue;

      // Clamp score
      const score = Math.max(0, Math.min(100, tool.usageScore || 50));

      if (existing) {
        // Update existing tool score and sentiment
        await prisma.marketingTool.update({
          where: { id: existing.id },
          data: {
            usageScore: Math.round((existing.usageScore + score) / 2),
            reviewSentiment: tool.reviewSentiment || "neutral",
          },
        });
        updated++;
        updatedNames.push(tool.name);
      } else {
        // Insert new tool
        try {
          await prisma.marketingTool.create({
            data: {
              name: tool.name,
              description: tool.description,
              category: tool.category,
              sourceUrl: tool.sourceUrl,
              usageScore: score,
              reviewSentiment: tool.reviewSentiment || "neutral",
              isNewLaunch: true,
            },
          });
          added++;
          addedNames.push(tool.name);
          existingNormalized.set(normalized, { id: -1, name: tool.name, usageScore: score });
        } catch {
          // Skip duplicates (unique constraint)
        }
      }
    }

    return NextResponse.json({
      success: true,
      searchResultsCount: allResults.length,
      parsedToolsCount: parsedTools.length,
      added,
      updated,
      addedNames,
      updatedNames,
    });
  } catch (err) {
    console.error("fetch-tools error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
