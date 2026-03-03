"use client";

import { MovieData } from "@/types";
import Image from "next/image";

interface MovieCardProps {
    movie: MovieData;
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <div className="movie-card">
            <div className="movie-card-inner">
                {/* Poster */}
                <div className="movie-poster-container">
                    {movie.poster ? (
                        <Image
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            className="movie-poster"
                            width={220}
                            height={330}
                            priority
                            unoptimized // OMDb images are external
                        />
                    ) : (
                        <div className="no-poster">No Poster Available</div>
                    )}
                </div>

                {/* Details */}
                <div className="movie-details">
                    <h3 className="movie-title">{movie.title}</h3>

                    {/* Meta badges */}
                    <div className="movie-meta">
                        <span className="meta-badge">📅 {movie.year}</span>
                        {movie.imdbRating && (
                            <span className="meta-badge rating">⭐ {movie.imdbRating}/10</span>
                        )}
                        <span className="meta-badge">🎬 {movie.runtime}</span>
                        {movie.rated && movie.rated !== "N/A" && (
                            <span className="meta-badge">🏷️ {movie.rated}</span>
                        )}
                    </div>

                    {/* Genre */}
                    {movie.genre && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">Genre</div>
                            <div className="movie-info-value">{movie.genre}</div>
                        </div>
                    )}

                    {/* Director */}
                    {movie.director && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">Director</div>
                            <div className="movie-info-value">{movie.director}</div>
                        </div>
                    )}

                    {/* Cast */}
                    {movie.actors && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">Cast</div>
                            <div className="movie-info-value">{movie.actors}</div>
                        </div>
                    )}

                    {/* Box Office */}
                    {movie.boxOffice && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">Box Office</div>
                            <div className="movie-info-value">{movie.boxOffice}</div>
                        </div>
                    )}

                    {/* Plot */}
                    {movie.plot && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">Plot Summary</div>
                            <p className="movie-plot">{movie.plot}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
