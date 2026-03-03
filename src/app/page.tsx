"use client";

import { useState, useCallback } from "react";
import SearchInput from "@/components/SearchInput";
import MovieCard from "@/components/MovieCard";
import SentimentPanel from "@/components/SentimentPanel";
import LoadingState from "@/components/LoadingState";
import { MovieData, SentimentData } from "@/types";

type AppState = "idle" | "loading" | "results" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = useCallback(async (imdbId: string) => {
    setAppState("loading");
    setMovieData(null);
    setSentimentData(null);
    setErrorMessage("");

    try {
      // Step 1: Fetch movie details from OMDb
      setLoadingStatus("Fetching movie details from IMDb...");
      const movieRes = await fetch(`/api/movie?id=${encodeURIComponent(imdbId)}`);
      const movieJson = await movieRes.json();

      if (!movieRes.ok) {
        throw new Error(movieJson.error || "Failed to fetch movie data.");
      }

      setMovieData(movieJson as MovieData);

      // Step 2: Fetch real audience reviews from TMDB
      setLoadingStatus("Fetching audience reviews from TMDB...");
      let reviews: { author: string; content: string }[] = [];

      try {
        const reviewsRes = await fetch(`/api/reviews?id=${encodeURIComponent(imdbId)}`);
        const reviewsJson = await reviewsRes.json();

        if (reviewsRes.ok && reviewsJson.reviews?.length > 0) {
          reviews = reviewsJson.reviews;
        }
      } catch (reviewErr) {
        // Reviews fetch failed — will still continue with AI analysis
        // Gemini will fall back to its training knowledge
        console.warn("Could not fetch TMDB reviews, proceeding without them:", reviewErr);
      }

      // Step 3: Send movie metadata + real reviews to Gemini for analysis
      setLoadingStatus(
        reviews.length > 0
          ? `Analyzing ${reviews.length} real audience reviews with AI...`
          : "Analyzing audience sentiment with AI..."
      );

      const sentimentRes = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: movieJson.title,
          year: movieJson.year,
          plot: movieJson.plot,
          genre: movieJson.genre,
          imdbRating: movieJson.imdbRating,
          director: movieJson.director,
          actors: movieJson.actors,
          reviews, // Pass real reviews to sentiment route
        }),
      });

      const sentimentJson = await sentimentRes.json();

      if (!sentimentRes.ok) {
        // Still show movie data even if sentiment fails
        console.error("Sentiment analysis failed:", sentimentJson.error);
        setAppState("results");
        return;
      }

      setSentimentData(sentimentJson as SentimentData);
      setAppState("results");

    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setAppState("error");
    }
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-icon">🎬</div>
          <h1> AI Movie Insight Builder</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <h2>Discover Movie Insights</h2>
          <p>
            Enter an IMDb movie ID and let AI analyze audience sentiment,
            critical reception, and key themes.
          </p>
        </section>

        {/* Search */}
        <SearchInput
          onSearch={handleSearch}
          isLoading={appState === "loading"}
        />

        {/* Loading */}
        {appState === "loading" && <LoadingState status={loadingStatus} />}

        {/* Error */}
        {appState === "error" && (
          <div
            className="results-section"
            style={{
              textAlign: "center",
              padding: "48px 24px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>😕</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "8px" }}>
              Something went wrong
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.95rem",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {/* Results */}
        {appState === "results" && movieData && (
          <div className="results-section">
            <MovieCard movie={movieData} />
            {sentimentData && <SentimentPanel sentiment={sentimentData} />}
          </div>
        )}
      </main>
      
    </div>
  );
}