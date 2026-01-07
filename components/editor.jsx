"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="bg-white p-2 border">
      <EditorContent editor={editor} />
    </div>
  );
}
