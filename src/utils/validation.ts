/**
 * Validates an IMDb ID format.
 * Valid format: 'tt' followed by 7 or 8 digits (e.g., tt0133093)
 */
export function validateImdbId(id: string): {
    valid: boolean;
    error?: string;
} {
    const trimmed = id.trim();

    if (!trimmed) {
        return { valid: false, error: "Please enter an IMDb ID." };
    }

    if (!trimmed.startsWith("tt")) {
        return {
            valid: false,
            error: "IMDb ID must start with 'tt' (e.g., tt0133093).",
        };
    }

    const imdbIdRegex = /^tt\d{7,8}$/;
    if (!imdbIdRegex.test(trimmed)) {
        return {
            valid: false,
            error:
                "Invalid format. IMDb ID should be 'tt' followed by 7-8 digits (e.g., tt0133093).",
        };
    }

    return { valid: true };
}
