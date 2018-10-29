import CombineLatestStream from './combine-latest-stream';
import ReplayStream from './replay-stream';

describe('subscribe', () => {
  test('subscribes to each stream', () => {
    const s1 = ReplayStream();
    const stream = CombineLatestStream({ s1 });
    stream.subscribe();
    expect(s1.getSubscriptions()).toHaveLength(1);
  });
});

describe('unsubscribe', () => {
  test('unsubscribes from all streams', () => {
    const s1 = ReplayStream();
    const stream = CombineLatestStream({ s1 });
    stream.subscribe().unsubscribe();
    expect(s1.getSubscriptions()).toHaveLength(0);
  });
});

test('starts to emit after each stream emits at least once', () => {
  const s1 = ReplayStream();
  const s2 = ReplayStream();
  const s3 = ReplayStream();
  const stream = CombineLatestStream({
    s1,
    s2,
    s3,
  });
  const next = jest.fn();
  stream.subscribe({ next });
  expect(next).not.toHaveBeenCalled();

  const v1 = 1;
  s1.next(v1);
  expect(next).not.toHaveBeenCalled();

  const v2 = 'foo';
  s2.next(v2);
  expect(next).not.toHaveBeenCalled();

  const v3 = true;
  s3.next(v3);
  expect(next).toHaveBeenCalledWith({
    s1: v1,
    s2: v2,
    s3: v3,
  });
});

test('emitted value is combination of latest value from each stream ', () => {
  const updates = [
    { v1: 1, v2: 'a' },
    { v1: 2, v2: 'b' },
    { v1: 3, v2: 'c' },
    { v1: 4, v2: 'd' },
  ];

  const expectedCombinations = [
    { s1: 1, s2: 'a' },
    { s1: 2, s2: 'a' },
    { s1: 2, s2: 'b' },
    { s1: 3, s2: 'b' },
    { s1: 3, s2: 'c' },
    { s1: 4, s2: 'c' },
    { s1: 4, s2: 'd' },
  ];

  const s1 = ReplayStream();
  const s2 = ReplayStream();
  const stream = CombineLatestStream({ s1, s2 });
  const next = jest.fn();
  stream.subscribe({ next });

  updates.forEach(({ v1, v2 }) => {
    s1.next(v1);
    s2.next(v2);
  });

  expect(next).toHaveBeenCalledTimes(expectedCombinations.length);
  expectedCombinations.forEach((combination) => {
    expect(next).toHaveBeenCalledWith(combination);
  });
});

test("multiple subscribers don't impact each other", () => {
  const updates = [
    { v1: 1, v2: 'a' },
    { v1: 2, v2: 'b' },
    { v1: 3, v2: 'c' },
    { v1: 4, v2: 'd' },
  ];

  const expectedFirstCombination = [
    { s1: 1, s2: 'a' },
    { s1: 2, s2: 'b' },
    { s1: 3, s2: 'c' },
    { s1: 4, s2: 'd' },
  ];

  const expectedNumberOfCombinations = [7, 5, 3, 1];

  const s1 = ReplayStream();
  const s2 = ReplayStream();
  const stream = CombineLatestStream({ s1, s2 });

  const nextFns = updates.map(({ v1, v2 }) => {
    const next = jest.fn();
    stream.subscribe({ next });
    s1.next(v1);
    s2.next(v2);
    return next;
  });

  nextFns.forEach((next, index) => {
    expect(next).toHaveBeenCalledTimes(expectedNumberOfCombinations[index]);
    expect(next).toHaveBeenCalledWith(expectedFirstCombination[index]);
  });
});
