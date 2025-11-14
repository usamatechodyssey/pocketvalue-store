// src/utils/portableTextToString.ts

/**
 * Interface for a basic Portable Text block containing spans with text.
 * This covers the most common structure for paragraphs.
 */
interface PortableTextBlock {
  _type: 'block';
  children: {
    _type: 'span';
    text: string;
  }[];
}

/**
 * Converts an array of Sanity Portable Text blocks into a single plain-text string.
 * This is useful for generating descriptions for SEO metadata or JSON-LD.
 *
 * @param blocks - The array of Portable Text blocks (e.g., from a 'description' field).
 * @returns A single string with all text content concatenated.
 */
export function portableTextToString(blocks: PortableTextBlock[] | undefined | null): string {
  // If the input is null, undefined, or not an array, return an empty string.
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }

  // Map over each block in the array.
  return blocks
    .map(block => {
      // Ensure the block is of type 'block' and has children to process.
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      // Map over the children (spans) of the block and extract their text.
      return block.children.map(child => child.text).join('');
    })
    // Join the text from all blocks with a space for readability.
    .join(' \n\n');
}