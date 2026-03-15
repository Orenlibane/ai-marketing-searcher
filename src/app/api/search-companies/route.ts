import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

function buildSystemPrompt(): string {
  return `You are an AI that generates realistic marketing agency/company data for a search directory.

When given a search query, generate EXACTLY 5 distinct, realistic marketing companies/agencies that match the query.

Each company MUST follow this exact JSON schema:
{
  "id": "unique-kebab-case-string",
  "name": "Company Name",
  "cat": "Category name (one of: Video, SEO, Branding, Content, Social, Analytics, Email, Ads, Design)",
  "color": "#hex (dark color for text on light background)",
  "bg": "#hex (light/pastel background color)",
  "initials": "AB (exactly 2 uppercase letters from company name)",
  "desc": "2-3 sentence description of the company and its specialties",
  "tags": ["3-5 relevant skill tags"],
  "rating": 4.5,
  "reviews": 85,
  "price": "one of: ₪, ₪₪, ₪₪₪",
  "verified": true or false,
  "featured": true or false,
  "isNew": true or false,
  "location": "City, Country",
  "founded": "YYYY (year between 2010 and 2025)",
  "team": "one of: 1-5, 5-10, 10-25, 25-50, 50-100, 100+",
  "website": "https://realistic-domain.com",
  "services": ["4-6 specific service offerings"],
  "revs": [3 review objects, each: {"n":"Full Name","av":"#hex","r":integer 3-5,"d":"relative time like 2 months ago","t":"1-2 sentence review text"}]
}

Rules:
- Return ONLY a valid JSON array of exactly 5 objects. No markdown, no explanation, no wrapping.
- Rating must be a number between 3.5 and 5.0 with one decimal place.
- Reviews must be an integer between 10 and 500.
- Make companies diverse in rating, price, team size, and location.
- Company names should sound realistic and professional.
- Descriptions should be specific to the services they offer.
- Reviews should sound authentic with varied sentiments.
- Each company should have a unique color scheme.
- At least 2 companies should be verified.
- At most 2 should be featured.
- At most 1 should be isNew.`;
}

function buildUserPrompt(query: string, category?: string): string {
  let prompt = `Search query: "${query}"`;
  if (category) {
    prompt += `\nPreferred category: ${category}`;
  }
  prompt += `\n\nGenerate 5 matching marketing agencies/companies as a JSON array.`;
  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category } = body as { query?: string; category?: string };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(query.trim(), category);

    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
      try {
        const message = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });

        const content = message.content[0];
        if (content.type !== "text") {
          return NextResponse.json(
            { error: "Unexpected response format" },
            { status: 500 }
          );
        }

        const text = content.text.trim();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          return NextResponse.json(
            { error: "Could not parse AI response" },
            { status: 500 }
          );
        }

        const companies = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(companies)) {
          return NextResponse.json(
            { error: "Invalid response structure" },
            { status: 500 }
          );
        }

        return NextResponse.json({ companies });
      } catch (err) {
        lastError = err as Error;
        const status = (err as { status?: number }).status;
        if (status === 529 || status === 429) {
          console.warn(
            `search-companies attempt ${attempt + 1} failed (${status}), retrying...`
          );
          continue;
        }
        throw err;
      }
    }

    throw lastError ?? new Error("API call failed after retries");
  } catch (err) {
    console.error("search-companies error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
