import CombineLatestStream from './combine-latest-stream';
import ReplayStream from './replay-stream';

describe('subscribe', () => {
  test('subscribes to each stream', () => {
    const s1 = new ReplayStream();
    const s2 = new ReplayStream();
    const stream = CombineLatestStream({ s1, s2 });
    stream.subscribe();
    expect(s1.getSubscriptions()).toHaveLength(1);
    expect(s2.getSubscriptions()).toHaveLength(1);
  });

  test('starts to emit after each stream emits at least once', () => {
    const s1 = new ReplayStream();
    const s2 = new ReplayStream();
    const s3 = new ReplayStream();
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
    const updates = [{ v1: 1, v2: 'a' }, { v1: 2, v2: 'b' }];

    const expectedCombinations = [
      { s1: 1, s2: 'a' },
      { s1: 2, s2: 'a' },
      { s1: 2, s2: 'b' },
    ];

    const s1 = new ReplayStream();
    const s2 = new ReplayStream();
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
    ];

    const expectedFirstCombination = [
      { s1: 1, s2: 'a' },
      { s1: 2, s2: 'b' },
      { s1: 3, s2: 'c' },
    ];

    const expectedNumberOfCombinations = [5, 3, 1];

    const s1 = new ReplayStream();
    const s2 = new ReplayStream();
    const stream = CombineLatestStream({ s1, s2 });

    const subscribers = updates.map(({ v1, v2 }) => {
      const subscriber = { next: jest.fn() };
      stream.subscribe(subscriber);
      s1.next(v1);
      s2.next(v2);
      return subscriber;
    });

    subscribers.forEach((subscriber, index) => {
      expect(subscriber.next).toHaveBeenCalledTimes(
        expectedNumberOfCombinations[index]
      );
      expect(subscriber.next).toHaveBeenCalledWith(
        expectedFirstCombination[index]
      );
    });
  });
});

describe('unsubscribe', () => {
  test('unsubscribes from all streams', () => {
    const s1 = new ReplayStream();
    const s2 = new ReplayStream();
    const stream = CombineLatestStream({ s1, s2 });
    stream.subscribe().unsubscribe();
    expect(s1.getSubscriptions()).toHaveLength(0);
    expect(s2.getSubscriptions()).toHaveLength(0);
  });

  test('do not affect other subscriptions', () => {
    const updatesBefore = { v1: 1, v2: 'a' };
    const updatesAfter = { v1: 2, v2: 'b' };

    const s1 = new ReplayStream();
    const s2 = new ReplayStream();
    const stream = CombineLatestStream({ s1, s2 });

    const subscriber1 = { next: jest.fn() };
    const subscriber2 = { next: jest.fn() };
    stream.subscribe(subscriber1);
    const subscription = stream.subscribe(subscriber2);
    s1.next(updatesBefore.v1);
    s2.next(updatesBefore.v2);

    subscription.unsubscribe();
    s1.next(updatesAfter.v1);
    s2.next(updatesAfter.v2);

    expect(subscriber1.next).toHaveBeenCalledTimes(3);
    expect(subscriber2.next).toHaveBeenCalledTimes(1);
  });
});
