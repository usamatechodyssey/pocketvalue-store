// /app/admin/products/_components/RichTextEditor.tsx

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap-styles.css";

// --- UPDATED INTERFACE ---
// The component now handles JSON, not HTML strings.
interface RichTextEditorProps {
  value: any; // Can be Tiptap JSON object or null
  onChange: (richTextAsJson: any) => void;
}

const TiptapEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    // === THE FIX IS HERE ===
    // This setting tells Tiptap to wait for the client to render,
    // preventing the SSR hydration error.
    immediatelyRender: false,
    // =======================

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
    ],
    content: value, // Tiptap can handle the JSON object directly
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert rounded-b-md border border-t-0 p-4 min-h-[150px] focus:outline-none focus:border-brand-primary dark:border-gray-600 w-full",
      },
    },
    onUpdate({ editor }) {
      // --- IMPORTANT CHANGE ---
      // We now output JSON to match the server action's expectation.
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="rounded-md border border-gray-300 dark:border-gray-600">
      {/* We can add a simple toolbar here later if needed */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
