# CineInsight AI — Movie Sentiment Analyzer

A beautiful, full-stack Next.js application where users enter an IMDb movie ID and get detailed movie information along with AI-powered audience sentiment analysis.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple?logo=google)

## ✨ Features

- **Movie Details** — Poster, title, year, rating, runtime, genre, director, cast, plot summary, box office
- **AI Sentiment Analysis** — Powered by Google Gemini to analyze audience reception
- **Sentiment Classification** — Positive / Mixed / Negative with color-coded badges
- **Audience Highlights** — What audiences loved and common criticisms
- **Key Themes** — AI-extracted themes from audience feedback
- **Critical Consensus** — One-line summary of critical reception
- **Responsive Design** — Works beautifully on desktop, tablet, and mobile
- **Premium UI** — Dark theme, glassmorphism, gradient accents, skeleton loaders, smooth animations
- **Input Validation** — Real-time validation of IMDb ID format with helpful error messages
- **Error Handling** — Graceful error states for API failures, invalid IDs, and network issues

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Full-stack React framework with API routes, server-side rendering, and file-based routing |
| **TypeScript** | Type safety across the entire codebase |
| **Google Gemini AI** | Audience sentiment analysis and insight generation |
| **OMDb API** | Movie metadata (title, poster, cast, ratings, etc.) |
| **Vanilla CSS** | Complete control over styling without framework overhead |

### Why This Stack?

- **Next.js** — Single framework for both frontend and backend (API routes), with built-in optimizations for images, fonts, and caching. Aligns with modern React best practices.
- **TypeScript** — Catches type errors at build time, makes refactoring safe, and improves developer experience.
- **Google Gemini AI** — Free tier available, excellent at understanding movie context and generating nuanced sentiment analysis.
- **OMDb API** — Reliable, well-documented movie data API with a generous free tier (1,000 req/day).
- **Vanilla CSS** — Full design control with CSS custom properties for a consistent design system. No build-time CSS processing needed.

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- An OMDb API key ([get free key](http://www.omdbapi.com/apikey.aspx))
- A Google Gemini API key ([get free key](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone <url>

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your API keys:

```env
OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Running Tests

```bash
npm test
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── movie/route.ts       # OMDb API integration
│   │   └── sentiment/route.ts   # Gemini AI sentiment analysis
│   ├── globals.css              # Design system & styles
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page (state management & orchestration)
├── components/
│   ├── SearchInput.tsx          # IMDb ID input with validation
│   ├── MovieCard.tsx            # Movie details display
│   ├── SentimentPanel.tsx       # AI sentiment analysis display
│   └── LoadingState.tsx         # Skeleton loading states
├── types/
│   └── index.ts                 # TypeScript type definitions
└── utils/
    └── validation.ts            # IMDb ID validation logic
```

## 🎬 Usage

1. Open the app in your browser
2. Enter a valid IMDb movie ID (e.g., `tt0133093` for The Matrix)
3. Click "Analyze" or press Enter
4. View movie details and AI-generated sentiment analysis

### Finding IMDb IDs

Go to [imdb.com](https://www.imdb.com), search for a movie, and copy the ID from the URL:
`https://www.imdb.com/title/tt0133093/` → ID is `tt0133093`

## 📝 Assumptions

- **Sentiment Source**: Uses Google Gemini AI's training knowledge for audience sentiment rather than live review scraping. This provides more reliable, structured insights and avoids IMDb scraping ToS issues.
- **API Limits**: OMDb free tier allows 1,000 requests/day. Gemini free tier has generous limits for development.
- **Movie Coverage**: Best results for well-known movies that Gemini has knowledge of. Lesser-known films may have less detailed sentiment analysis.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables (`OMDB_API_KEY`, `GEMINI_API_KEY`) in Vercel dashboard
4. Deploy!

## License

MIT
