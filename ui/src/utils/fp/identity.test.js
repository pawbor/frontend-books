import identity from './identity';

test('returns first argument', () => {
  expect(identity()).toBe(undefined);
  expect(identity(10)).toBe(10);
  expect(identity('foo', 'bar')).toBe('foo');
});
