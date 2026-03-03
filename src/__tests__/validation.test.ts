import { validateImdbId } from "@/utils/validation";

describe("validateImdbId", () => {
    // Valid IDs
    test("accepts valid 7-digit IMDb ID", () => {
        const result = validateImdbId("tt0133093");
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    test("accepts valid 8-digit IMDb ID", () => {
        const result = validateImdbId("tt10872600");
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    test("trims whitespace from input", () => {
        const result = validateImdbId("  tt0133093  ");
        expect(result.valid).toBe(true);
    });

    // Invalid IDs
    test("rejects empty string", () => {
        const result = validateImdbId("");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("enter");
    });

    test("rejects whitespace-only string", () => {
        const result = validateImdbId("   ");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("enter");
    });

    test("rejects ID without tt prefix", () => {
        const result = validateImdbId("0133093");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("tt");
    });

    test("rejects ID with wrong prefix", () => {
        const result = validateImdbId("nm0133093");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("tt");
    });

    test("rejects ID with too few digits", () => {
        const result = validateImdbId("tt01330");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("7-8 digits");
    });

    test("rejects ID with too many digits", () => {
        const result = validateImdbId("tt012345678");
        expect(result.valid).toBe(false);
        expect(result.error).toContain("7-8 digits");
    });

    test("rejects ID with letters after tt", () => {
        const result = validateImdbId("ttabcdefg");
        expect(result.valid).toBe(false);
    });

    test("rejects random text", () => {
        const result = validateImdbId("the matrix");
        expect(result.valid).toBe(false);
    });
});
