"use client";

interface LoadingStateProps {
    status: string;
}

export default function LoadingState({ status }: LoadingStateProps) {
    return (
        <div className="loading-section">
            {/* Movie skeleton */}
            <div className="skeleton-card">
                <div className="skeleton skeleton-poster" />
                <div className="skeleton-content">
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton-badges">
                        <div className="skeleton skeleton-badge" />
                        <div className="skeleton skeleton-badge" />
                        <div className="skeleton skeleton-badge" />
                    </div>
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line" />
                    <div className="skeleton skeleton-line" />
                </div>
            </div>

            {/* Sentiment skeleton */}
            <div className="skeleton-sentiment">
                <div className="skeleton-sentiment-header">
                    <div className="skeleton skeleton-sentiment-title" />
                    <div className="skeleton skeleton-sentiment-badge" />
                </div>
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
            </div>

            {/* Status message */}
            <div className="loading-status">
                <span className="loading-spinner" />
                {status}
            </div>
        </div>
    );
}
