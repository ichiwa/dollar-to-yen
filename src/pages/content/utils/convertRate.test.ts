import { convertRate } from './convertRate';
import { describe, it, expect, vi } from 'vitest';

const chromeMock = {
  storage: {
    local: {
      get: async () => {
        return {
          currentRate: 100,
        };
      },
    },
  },
};

vi.stubGlobal('chrome', chromeMock);

describe('utils', () => {
  it('convertRate', async () => {
    expect(await convertRate('100ドル')).toEqual([true, '約1万円']);
    expect(await convertRate('0.09ドル')).toEqual([true, '約9円']);
    expect(await convertRate('157億ドル')).toEqual([true, '約1.6兆円']);
    expect(await convertRate('10億1,000万ドル')).toEqual([true, '約1000億円']);
    expect(await convertRate('730万ドル')).toEqual([true, '約7.3億円']);
    expect(await convertRate('$1000')).toEqual([true, '約10万円']);
    expect(await convertRate('$19.9 million')).toEqual([true, '約20億円']);
    expect(await convertRate('$0.6 billion')).toEqual([true, '約600億円']);
    expect(await convertRate('$1,897,839')).toEqual([true, '約1.9億円']);
    expect(await convertRate(' $180 million ')).toEqual([true, '約180億円']);
    expect(await convertRate('$2.37 billion.')).toEqual([true, '約2400億円']);
    expect(
      await convertRate(
        'まだ適用していない & 一定の効果が見込める & 導入までの道のりが険しいルール'
      )
    ).toEqual([false, '0円']);
  });
});
