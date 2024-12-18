/**
 * Returns the singular or plural form of a word based on the provided count.
 *
 * @param count - The count determining which form to return.
 * @param singular - The singular form of the word.
 * @param plural - The plural form of the word. If not provided, it defaults to the singular form with an "s" appended.
 * @returns The appropriate form of the word based on the count.
 *
 * @example
 * pluralize(1, "apple");      // "apple"
 * pluralize(5, "apple");      // "apples"
 * pluralize(2, "person", "people"); // "people"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
    plural ??= `${singular}s`;
    return count === 1 ? singular : plural;
}