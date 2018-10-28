import CombineLatestStream from './combine-latest-stream';
import ReplayStream from './replay-stream';

test('first emit', () => {
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

test('subsequent emits', () => {
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
