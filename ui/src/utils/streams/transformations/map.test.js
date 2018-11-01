import { sequence } from 'utils/array';

import ArrayStream from '../array-stream';
import map from './map';

test('maps values from a stream with mapping function', () => {
  const stream = ArrayStream(sequence(10));
  const mapping = (/** @type {number} */ value) => value + 2;
  const expectedSequence = sequence(10, { start: 2 });

  const next = jest.fn();
  stream.transform(map(mapping)).subscribe({ next });

  expect(next).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(next).toHaveBeenNthCalledWith(index + 1, value);
  });
});
