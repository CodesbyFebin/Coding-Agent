import { describe, expect, it } from 'vitest';
import { MIN_EDITORIAL_WORDS, REGISTRY } from '../content/registry';
import { wordCount } from '../content/types';

describe('editorial publish bar', () => {
  it('keeps every registered editorial at or above the publish threshold', () => {
    const belowBar = Object.entries(REGISTRY)
      .map(([slug, editorial]) => ({ slug, words: wordCount(editorial) }))
      .filter(({ words }) => words < MIN_EDITORIAL_WORDS)
      .sort((a, b) => a.words - b.words);

    expect(belowBar).toEqual([]);
  });

  it('keeps the complete 35-editorial registry covered by the gate', () => {
    expect(Object.keys(REGISTRY)).toHaveLength(35);
  });
});
