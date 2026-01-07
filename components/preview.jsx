"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Preview({ value }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
  });

  return (
    <div className="tiptap-preview">
      <EditorContent editor={editor} />
    </div>
  );
}
