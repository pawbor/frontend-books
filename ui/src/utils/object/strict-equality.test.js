import strictEquality from './strict-equality';

const object = { sameRef: true };

/** @type {*} */
const array = ['same-ref'];

test.each([
  [1, 1, true],
  [1, 2, false],
  ['foo', 'foo', true],
  ['foo', 'bar', false],
  [true, true, true],
  [true, false, false],
  [object, object, true],
  [{}, {}, false],
  [array, array, true],
  [[], [], false],
])('strictEquality(%j, %j) === %s', (v1, v2, expectedResult) => {
  const result = strictEquality(v1, v2);
  expect(result).toBe(expectedResult);
});
