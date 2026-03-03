"use client";

import React, { useState } from "react";
import { validateImdbId } from "@/utils/validation";

interface SearchInputProps {
    onSearch: (imdbId: string) => void;
    isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateImdbId(inputValue);
        if (!validation.valid) {
            setError(validation.error || "Invalid IMDb ID.");
            return;
        }

        setError(null);
        onSearch(inputValue.trim());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (error) setError(null); // Clear error on typing
    };

    return (
        <div className="search-section">
            <form onSubmit={handleSubmit} className="search-container">
                <label htmlFor="imdb-input" className="search-label">
                    Enter IMDb Movie ID
                </label>
                <div className="search-input-wrapper">
                    <input
                        id="imdb-input"
                        type="text"
                        className={`search-input ${error ? "error" : ""}`}
                        placeholder="tt0133093"
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        autoComplete="off"
                        spellCheck={false}
                        aria-describedby={error ? "search-error" : "search-hint"}
                    />
                    <button
                        type="submit"
                        className="search-btn"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                Analyze
                            </>
                        )}
                    </button>
                </div>
                {error && (
                    <p id="search-error" className="error-message" role="alert">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </p>
                )}
                {!error && (
                    <p id="search-hint" className="search-hint">
                        Find it on IMDb → copy the ID from the URL, e.g.{" "}
                        <code>tt0133093</code> for The Matrix
                    </p>
                )}
            </form>
        </div>
    );
}
