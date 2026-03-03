import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews?id=tt0137523
 * Fetches real audience reviews from TMDB using an IMDb ID.
 *
 * Step 1: Convert IMDb ID → TMDB movie ID using TMDB's /find endpoint
 * Step 2: Fetch user reviews using the TMDB movie ID
 */
export async function GET(request: NextRequest) {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "TMDB API key is not configured. Please set TMDB_API_KEY in .env.local.", reviews: [] },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get("id");

    if (!imdbId) {
        return NextResponse.json(
            { error: "Missing required query parameter: id (IMDb ID)", reviews: [] },
            { status: 400 }
        );
    }

    try {
        // Step 1: Convert IMDb ID → TMDB movie ID using /find endpoint
        const findRes = await fetch(
            `https://api.themoviedb.org/3/find/${imdbId}?api_key=${apiKey}&external_source=imdb_id`
        );

        if (!findRes.ok) {
            throw new Error(`TMDB find request failed with status ${findRes.status}`);
        }

        const findData = await findRes.json();

        // TMDB returns matched movies in movie_results array
        const movie = findData.movie_results?.[0];

        if (!movie) {
            // Not found on TMDB — return empty reviews, don't crash
            return NextResponse.json({ reviews: [], tmdbId: null });
        }

        const tmdbId = movie.id;

        // Step 2: Fetch reviews from 2 pages to get more data
        // Each page returns up to 20 reviews
        const [page1Res, page2Res] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/reviews?api_key=${apiKey}&page=1`),
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/reviews?api_key=${apiKey}&page=2`),
        ]);

        const page1Data = await page1Res.json();
        const page2Data = page2Res.ok ? await page2Res.json() : { results: [] };

        // Combine both pages
        const allReviews = [
            ...(page1Data.results || []),
            ...(page2Data.results || []),
        ];

        if (allReviews.length === 0) {
            return NextResponse.json({ reviews: [], tmdbId });
        }

        // Trim each review to 500 chars to stay within Gemini token limits
        // Take max 10 reviews — enough for good analysis without bloating the prompt
        const reviews = allReviews
            .map((review: { author: string; content: string }) => ({
                author: review.author,
                content: review.content.slice(0, 500),
            }))
            .slice(0, 10);

        return NextResponse.json({ reviews, tmdbId });

    } catch (error) {
        console.error("Error fetching TMDB reviews:", error);
        // Return empty reviews so the app can still show sentiment via fallback
        return NextResponse.json(
            { error: "Failed to fetch reviews from TMDB.", reviews: [] },
            { status: 500 }
        );
    }
}