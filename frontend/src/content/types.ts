// Structured long-form editorial content for pillar pages. Each completed
// pillar has a PillarEditorial; the PillarDetailPage renders it, the
// indexability policy gates the sitemap on its presence, and the prerender
// ships it in the initial HTML. Content is hand-authored — never generated
// boilerplate — per the claim-safety doctrine: architecture is described as
// design direction, and compliance/regulatory outcomes stay qualified.

export interface EditorialSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface EditorialFaq {
  question: string;
  answer: string;
}

export interface PillarEditorial {
  pillarId: string;
  updated: string;
  definition: string;
  sections: EditorialSection[];
  faq: EditorialFaq[];
  sources?: { label: string; href: string }[];
}

export function wordCount(e: PillarEditorial): number {
  const parts: string[] = [e.definition];
  for (const s of e.sections) {
    parts.push(s.heading, ...s.paragraphs, ...(s.bullets ?? []));
  }
  for (const f of e.faq) {parts.push(f.question, f.answer);}
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}
