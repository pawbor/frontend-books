import { sequence } from 'utils/array';

import ArrayStream from '../array-stream';
import first from './first';
import ReplayStream from '../replay-stream';

test('passes first matching value and unsubscribes', () => {
  const stream = ArrayStream(sequence(10));
  const predicate = (/** @type {number} */ value) => Boolean(value % 2);
  const expectedSequence = [1];

  const next = jest.fn();
  stream.transform(first(predicate)).subscribe({ next });

  expect(next).toHaveBeenCalledTimes(expectedSequence.length);
  expectedSequence.forEach((value, index) => {
    expect(next).toHaveBeenNthCalledWith(index + 1, value);
  });
});

test('passes first matching value and unsubscribes', () => {
  const matchValue = 1;
  const stream = new ReplayStream();

  const subscribers = Array.from({ length: 3 }, () => {
    const sub = fakeSubscriber();
    stream.transform(first((v) => v === matchValue)).subscribe(sub);
    return sub;
  });

  stream.next(matchValue - 1);
  stream.next(matchValue + 1);
  stream.next(matchValue);
  stream.next(matchValue);
  
  subscribers.forEach((sub) => {
    expect(sub.next).toHaveBeenCalledTimes(1);
    expect(sub.next).toHaveBeenCalledWith(matchValue);
  });
});

function fakeSubscriber() {
  return { next: jest.fn() };
}
