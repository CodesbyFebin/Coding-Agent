import { useEffect } from 'react';

// Per-route document metadata for rankable pillar pages. Sets <title> and the
// meta description so each pillar surfaces as a first-class search entity.
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
    return () => {
      document.title =
        'CodingAgent.in — Sovereign AI Coding Agents & Agentic Engineering';
    };
  }, [title, description]);
}
