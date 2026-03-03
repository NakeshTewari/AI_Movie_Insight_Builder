"use client";

import React from "react";
import { SentimentData } from "@/types";

interface SentimentPanelProps {
    sentiment: SentimentData;
}

export default function SentimentPanel({ sentiment }: SentimentPanelProps) {
    const classificationEmoji = {
        positive: "😊",
        mixed: "🤔",
        negative: "😞",
    };

    return (
        <div className="sentiment-panel">
            {/* Header */}
            <div className="sentiment-header">
                <div className="sentiment-title">
                    <span className="sentiment-title-icon">🤖</span>
                    AI Audience Sentiment Analysis
                </div>
                <span className={`sentiment-badge ${sentiment.classification}`}>
                    <span className="sentiment-dot" />
                    {classificationEmoji[sentiment.classification]}{" "}
                    {sentiment.classification}
                </span>
            </div>

            {/* Summary */}
            <p className="sentiment-summary">{sentiment.summary}</p>

            {/* Audience Highlights */}
            {sentiment.audienceHighlights && (
                <div style={{ marginBottom: "24px" }}>
                    {sentiment.audienceHighlights.praised?.length > 0 && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">👍 What Audiences Loved</div>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                }}
                            >
                                {sentiment.audienceHighlights.praised.map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "var(--text-secondary)",
                                            paddingLeft: "16px",
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                color: "var(--sentiment-positive)",
                                            }}
                                        >
                                            +
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {sentiment.audienceHighlights.criticized?.length > 0 && (
                        <div className="movie-info-section">
                            <div className="movie-info-label">👎 Common Criticisms</div>
                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                }}
                            >
                                {sentiment.audienceHighlights.criticized.map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "var(--text-secondary)",
                                            paddingLeft: "16px",
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                color: "var(--sentiment-negative)",
                                            }}
                                        >
                                            −
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Critical Consensus */}
            {sentiment.criticalConsensus && (
                <div
                    style={{
                        padding: "14px 18px",
                        background: "var(--bg-glass-strong)",
                        borderRadius: "var(--radius-md)",
                        borderLeft: "3px solid var(--accent-purple)",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        className="movie-info-label"
                        style={{ marginBottom: "4px", fontSize: "0.7rem" }}
                    >
                        Critical Consensus
                    </div>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                            fontStyle: "italic",
                            lineHeight: 1.6,
                        }}
                    >
                        &ldquo;{sentiment.criticalConsensus}&rdquo;
                    </p>
                </div>
            )}

            {/* Themes */}
            {sentiment.themes?.length > 0 && (
                <div className="sentiment-themes">
                    <span className="sentiment-themes-label">Key Audience Themes</span>
                    {sentiment.themes.map((theme, index) => (
                        <span key={index} className="theme-tag">
                            {theme}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
