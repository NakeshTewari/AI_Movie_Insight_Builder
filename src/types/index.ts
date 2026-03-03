export interface MovieData {
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    awards: string;
    poster: string | null;
    imdbRating: string | null;
    imdbVotes: string | null;
    imdbID: string;
    type: string;
    boxOffice: string | null;
}

export interface Review {
    author: string;
    content: string;
}

export interface SentimentData {
    summary: string;
    classification: "positive" | "mixed" | "negative";
    themes: string[];
    audienceHighlights: {
        praised: string[];
        criticized: string[];
    };
    criticalConsensus: string;
    reviewCount: number;         // How many real reviews were analyzed
    basedOnRealReviews: boolean; // true = real TMDB reviews, false = AI knowledge
}

export interface ApiError {
    error: string;
}