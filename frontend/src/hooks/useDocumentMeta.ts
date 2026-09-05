import { useEffect } from 'react';

// Per-route document metadata for rankable knowledge pages. Sets <title>,
// the meta description, and an absolute canonical URL derived from the
// current path so the same content served from any other host (e.g. the
// noindex app deployment) consolidates to the public codingagent.in origin.
export function useDocumentMeta(
  title: string,
  description?: string,
  noindex = false
): void {
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
    // Indexability policy: template-only pillar pages carry noindex until
    // their editorial is completed (mirrored in the prerendered HTML).
    let robots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]:not([content*="max-image"])'
    );
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, follow';
    }

    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    // index.html ships a site-wide canonical; knowledge pages override it
    // per-path and restore it on unmount.
    const original = canonical?.href ?? null;
    let link = canonical;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `https://codingagent.in${window.location.pathname}`;

    return () => {
      document.title =
        'CodingAgent.in — Sovereign AI Coding Agents & Agentic Engineering';
      if (original) {
        link!.href = original;
      } else {
        link!.remove();
      }
    };
  }, [title, description]);
}
