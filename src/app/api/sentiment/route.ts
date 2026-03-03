import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/sentiment
 * Uses Google Gemini AI to analyze audience sentiment for a movie.
 * Body: { title, year, plot, genre, imdbRating, director, actors, reviews }
 *
 * If `reviews` (real TMDB reviews) are provided, Gemini analyzes actual review text.
 * If no reviews available, Gemini falls back to its training knowledge.
 */
export async function POST(request: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
        return NextResponse.json(
            { error: "Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local." },
            { status: 500 }
        );
    }

    let body: {
        title?: string;
        year?: string;
        plot?: string;
        genre?: string;
        imdbRating?: string;
        director?: string;
        actors?: string;
        reviews?: { author: string; content: string }[];
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body." },
            { status: 400 }
        );
    }

    const { title, year, plot, genre, imdbRating, director, actors, reviews } = body;

    if (!title) {
        return NextResponse.json(
            { error: "Missing required field: title" },
            { status: 400 }
        );
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Check if we have real reviews to work with
        const hasRealReviews = reviews && reviews.length > 0;

        // Build the reviews section of the prompt conditionally
        const reviewsSection = hasRealReviews
            ? `
Real Audience Reviews (from TMDB):
${reviews!.map((r, i) => `Review ${i + 1} by ${r.author}:\n"${r.content}"`).join("\n\n")}

Based on these REAL audience reviews above, provide sentiment analysis.`
            : `No real reviews were available. Based on your general knowledge of this movie's reception, provide sentiment analysis.`;

        const prompt = `You are a movie critic and audience sentiment analyst.

Movie Details:
- Title: ${title}
- Year: ${year || "Unknown"}
- Genre: ${genre || "Unknown"}
- Director: ${director || "Unknown"}
- Cast: ${actors || "Unknown"}
- IMDb Rating: ${imdbRating || "Unknown"}/10
- Plot: ${plot || "No plot available"}

${reviewsSection}

Provide the following in JSON format (ONLY valid JSON, no markdown code blocks):

{
  "summary": "A 3-5 sentence summary of how audiences received this movie. Reference specific aspects from the reviews. Be specific and informative.",
  "classification": "positive" | "mixed" | "negative",
  "themes": ["theme1", "theme2", "theme3", "theme4", "theme5"],
  "audienceHighlights": {
    "praised": ["specific thing praised 1", "specific thing praised 2", "specific thing praised 3"],
    "criticized": ["specific criticism 1", "specific criticism 2"]
  },
  "criticalConsensus": "A single sentence summarizing the critical consensus.",
  "reviewCount": ${hasRealReviews ? reviews!.length : 0}
}

Rules:
- "themes" should be 4-6 key themes from the reviews (e.g., "Groundbreaking visual effects", "Complex narrative")
- "classification" must be exactly one of: "positive", "mixed", or "negative"
- "praised" should have 2-4 items, "criticized" should have 1-3 items
- Return ONLY valid JSON, no other text`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up response — Gemini sometimes wraps in markdown code blocks
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith("```json")) {
            cleanedResponse = cleanedResponse.slice(7);
        }
        if (cleanedResponse.startsWith("```")) {
            cleanedResponse = cleanedResponse.slice(3);
        }
        if (cleanedResponse.endsWith("```")) {
            cleanedResponse = cleanedResponse.slice(0, -3);
        }
        cleanedResponse = cleanedResponse.trim();

        const sentimentData = JSON.parse(cleanedResponse);

        return NextResponse.json({
            summary: sentimentData.summary,
            classification: sentimentData.classification,
            themes: sentimentData.themes || [],
            audienceHighlights: sentimentData.audienceHighlights || {
                praised: [],
                criticized: [],
            },
            criticalConsensus: sentimentData.criticalConsensus || "",
            reviewCount: sentimentData.reviewCount ?? (hasRealReviews ? reviews!.length : 0),
            basedOnRealReviews: hasRealReviews,
        });

    } catch (error) {
        console.error("Error generating sentiment analysis:", error);
        return NextResponse.json(
            { error: "Failed to generate sentiment analysis. Please check your Gemini API key and try again." },
            { status: 500 }
        );
    }
}