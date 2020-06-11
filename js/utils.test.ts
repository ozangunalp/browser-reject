import { merge } from './utils';

describe(`merge`, () => {
  const complex = {
    test: 'a value',
    obj: {
      str: 'a string',
      nbr: 2,
      otr: {
        arr: ['1', '2'],
        s: '',
      },
    },
  };
  it(`merge empty with undefined`, () => {
    const result = merge({});
    expect(result).toStrictEqual({});
  });
  it(`merge empty with empty`, () => {
    const result = merge({}, {});
    expect(result).toStrictEqual({});
  });
  it(`merge empty with value`, () => {
    const result = merge({}, { test: 'value' });
    expect((result as any)['test']).toBe('value');
  });
  it(`merge simple object with value`, () => {
    const result = merge({ test: 'a value' }, { test: 'other value' });
    expect((result as any)['test']).toBe('other value');
  });
  it(`merge complex object with value`, () => {
    const result = merge(complex, { test: 'other value' });
    expect((result as any)['test']).toBe('other value');
    expect((result as any)['obj']['otr']['s']).toBe('');
    expect((result as any)['obj']['otr']['arr'][0]).toBe('1');
  });
});
