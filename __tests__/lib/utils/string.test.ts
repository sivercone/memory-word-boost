import { describe, expect, it } from '@jest/globals';

import { trimExtraSpaces } from '@src/lib/utils/string';

describe('trimExtraSpaces', () => {
  it('trims leading/trailing and collapses internal spaces', () => {
    expect(trimExtraSpaces('  hello   world  ')).toBe('hello world');
    expect(trimExtraSpaces('\tfoo\n\tbar')).toBe('foo bar');
  });
});
