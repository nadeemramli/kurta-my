"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("Enter the URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("bold")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("italic")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("bulletList")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("orderedList")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("blockquote")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          onClick={setLink}
          className={`rounded p-2 hover:bg-gray-100 ${
            editor.isActive("link")
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600"
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          onClick={addImage}
          className="rounded p-2 text-gray-600 hover:bg-gray-100"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded p-2 text-gray-600 hover:bg-gray-100"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded p-2 text-gray-600 hover:bg-gray-100"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function RichTextEditor({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 focus:outline-none"
      />
    </div>
  );
}
