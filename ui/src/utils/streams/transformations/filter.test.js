import { sequence } from 'utils/array';

import ArrayStream from '../array-stream';
import filter from './filter';

test('remove values not matching predicate from a stream', () => {
  const stream = ArrayStream(sequence(10));
  const predicate = (/** @type {number} */value) => Boolean(value % 2);
  const expectedSequence = sequence(5, { increment: 2, start: 1 });

  const next = jest.fn();
  stream.transform(filter(predicate)).subscribe({ next });
  
  expect(next).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(next).toHaveBeenNthCalledWith(index + 1, value);
  });
});
