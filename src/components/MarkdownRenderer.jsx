import { marked } from "marked";
import { useMemo } from "react";

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
});

/**
 * Futuristic Markdown Renderer Component
 * Renders Markdown content with enhanced styling
 */
export default function MarkdownRenderer({ content, className = "" }) {
  const html = useMemo(() => {
    if (!content) return "";
    return marked.parse(content);
  }, [content]);

  return (
    <div
      className={`prose-futuristic ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
