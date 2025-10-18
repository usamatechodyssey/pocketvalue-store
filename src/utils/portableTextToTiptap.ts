// /src/utils/portableTextToTiptap.ts

// Yeh function Sanity ke Portable Text ko Tiptap ke samajhne wale JSON mein convert karta hai
export function portableTextToTiptapJson(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return { type: 'doc', content: [] };
  }

  const content = blocks.map(block => {
    if (block._type === 'block' && block.style === 'normal') {
      return {
        type: 'paragraph',
        content: block.children.map((span: any) => ({
          type: 'text',
          text: span.text,
          marks: span.marks ? span.marks.map((mark: string) => ({ type: mark })) : [],
        })),
      };
    }
    // Baaki block types (headings, etc.) ke liye yahan logic add ho sakta hai
    return null;
  }).filter(Boolean);

  return { type: 'doc', content };
}