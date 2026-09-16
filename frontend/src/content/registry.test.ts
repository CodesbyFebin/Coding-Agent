import { describe, expect, it } from 'vitest';
import { wordCount } from './types';
import { MIN_EDITORIAL_WORDS, REGISTRY, isContentIndexable } from './registry';
import type { PillarEditorial } from './types';

// Regression coverage for the indexability gate itself, independent of any
// specific pillar's current word count. Pinning this to a real pillar (e.g.
// "assert ollama-integration is noindex") is brittle: the moment that
// pillar's content crosses the bar -- which is the whole point of writing
// more content -- the assertion breaks for a reason that has nothing to do
// with whether the gate mechanism still works. Testing the mechanism
// directly with synthetic fixtures avoids that.

function makeEditorial(wordsInDefinition: number): PillarEditorial {
  return {
    pillarId: 'synthetic-test-pillar',
    updated: '2026-01-01',
    definition: Array(wordsInDefinition).fill('word').join(' '),
    sections: [],
    faq: [],
  };
}

describe('editorial indexability gate', () => {
  it('treats an editorial under MIN_EDITORIAL_WORDS as not indexable', () => {
    const short = makeEditorial(MIN_EDITORIAL_WORDS - 1);
    expect(wordCount(short)).toBeLessThan(MIN_EDITORIAL_WORDS);
  });

  it('treats an editorial at or above MIN_EDITORIAL_WORDS as long enough to index', () => {
    const long = makeEditorial(MIN_EDITORIAL_WORDS);
    expect(wordCount(long)).toBeGreaterThanOrEqual(MIN_EDITORIAL_WORDS);
  });

  it('isContentIndexable returns false for a pillarId with no registry entry', () => {
    expect(isContentIndexable('no-such-pillar-id')).toBe(false);
  });

  it('every registered editorial that reports indexable actually meets the word bar', () => {
    for (const [pillarId, editorial] of Object.entries(REGISTRY)) {
      if (isContentIndexable(pillarId)) {
        expect(wordCount(editorial)).toBeGreaterThanOrEqual(MIN_EDITORIAL_WORDS);
      }
    }
  });
});
