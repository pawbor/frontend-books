import { sequence } from 'utils/array';

import ArrayStream from '../array-stream';
import filter from './filter';

test('remove values not matching predicate from a stream', () => {
  const stream = ArrayStream(sequence(10));
  const predicate = (value) => value % 2;
  const next = jest.fn();
  stream.transform(filter(predicate)).subscribe({ next });
  const expectedSequence = sequence(5, { increment: 2, start: 1 });
  expect(next).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(next).toHaveBeenNthCalledWith(index + 1, value);
  });
});
