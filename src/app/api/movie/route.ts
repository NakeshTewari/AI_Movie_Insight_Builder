import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/movie?id=tt0133093
 * Fetches movie details from the OMDb API using an IMDb ID.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const imdbId = searchParams.get("id");

    // Validate presence
    if (!imdbId) {
        return NextResponse.json(
            { error: "Missing required parameter: id" },
            { status: 400 }
        );
    }

    // Validate IMDb ID format (e.g., tt0133093)
    const imdbIdRegex = /^tt\d{7,8}$/;
    if (!imdbIdRegex.test(imdbId)) {
        return NextResponse.json(
            {
                error:
                    "Invalid IMDb ID format. Must start with 'tt' followed by 7-8 digits (e.g., tt0133093).",
            },
            { status: 400 }
        );
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "OMDb API key is not configured. Please set OMDB_API_KEY in .env.local." },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}&plot=full`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            throw new Error(`OMDb API returned status ${response.status}`);
        }

        const data = await response.json();

        // OMDb returns { Response: "False", Error: "..." } for invalid IDs
        if (data.Response === "False") {
            return NextResponse.json(
                { error: data.Error || "Movie not found." },
                { status: 404 }
            );
        }

        // Return structured movie data
        return NextResponse.json({
            title: data.Title,
            year: data.Year,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            language: data.Language,
            country: data.Country,
            awards: data.Awards,
            poster: data.Poster !== "N/A" ? data.Poster : null,
            imdbRating: data.imdbRating !== "N/A" ? data.imdbRating : null,
            imdbVotes: data.imdbVotes !== "N/A" ? data.imdbVotes : null,
            imdbID: data.imdbID,
            type: data.Type,
            boxOffice: data.BoxOffice !== "N/A" ? data.BoxOffice : null,
        });
    } catch (error) {
        console.error("Error fetching movie data:", error);
        return NextResponse.json(
            { error: "Failed to fetch movie data. Please try again later." },
            { status: 500 }
        );
    }
}
