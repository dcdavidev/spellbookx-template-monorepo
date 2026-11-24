import { describe, expect, it } from 'vitest';

import { greet } from '../src/index.js';

describe('greet', () => {
  it('greets the world by default', () => {
    expect(greet()).toBe('Hello, world!');
  });

  it('greets the given name', () => {
    expect(greet('spellbookx')).toBe('Hello, spellbookx!');
  });
});
