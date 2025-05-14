/**
 * Generates a stable key for React list items based on content
 * @param prefix - A string prefix identifying the type of content
 * @param content - The content to generate the key from
 * @param index - A fallback index to ensure uniqueness
 * @returns A stable, unique key suitable for React list items
 */
export function generateStableKey(prefix: string, content: string, index: number): string {
  return `${prefix}-${content
    .slice(0, 20)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')}-${index}`
}
