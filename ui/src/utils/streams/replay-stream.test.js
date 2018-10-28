import { withoutElement } from 'utils/array';

import ReplayStream from './replay-stream';

describe('subscription', () => {
  let testSubscriber;

  beforeEach(() => {
    testSubscriber = fakeSubscriber();
  });

  test('single emit', () => {
    const emittedValue = 'foo';
    const stream = ReplayStream();
    stream.subscribe(testSubscriber);
    stream.next(emittedValue);

    expect(testSubscriber.next).toHaveBeenCalledTimes(1);
    expect(testSubscriber.next).toHaveBeenCalledWith(emittedValue);
  });

  test('unsubscribe', () => {
    const emittedBefore = 'foo';
    const emittedAfter = 'bar';
    const stream = ReplayStream();

    const subscriptions = Array.from({ length: 5 }, () => {
      const subscription = stream.subscribe();
      jest.spyOn(subscription, 'next');
      return subscription;
    });
    const chosenSubscription = subscriptions[2];
    const otherSubscriptions = withoutElement(
      subscriptions,
      chosenSubscription
    );

    stream.next(emittedBefore);
    chosenSubscription.unsubscribe();
    stream.next(emittedAfter);

    expect(chosenSubscription.next).toHaveBeenCalledTimes(1);
    expect(chosenSubscription.next).toHaveBeenCalledWith(emittedBefore);

    otherSubscriptions.forEach((sub) => {
      expect(sub.next).toHaveBeenCalledTimes(2);
    });
  });

  test('with asReadOnly', () => {
    const stream = ReplayStream({ initialValue: 1, bufferSize: 2 });
    stream.next(2);
    const subscription = stream.asReadOnly().subscribe(testSubscriber);
    stream.next(3);
    subscription.unsubscribe();
    stream.next(4);

    expect(testSubscriber.next).toHaveBeenCalledTimes(3);
    expect(testSubscriber.next).toHaveBeenCalledWith(1);
    expect(testSubscriber.next).toHaveBeenCalledWith(2);
    expect(testSubscriber.next).toHaveBeenCalledWith(3);
  });

  test('buffered emits', () => {
    const emittedValues = ['foo', 'bar', 'baz'];
    const stream = ReplayStream({ bufferSize: emittedValues.length });
    emittedValues.forEach((v) => {
      stream.next(v);
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).toHaveBeenCalledTimes(emittedValues.length);
    emittedValues.forEach((v) => {
      expect(testSubscriber.next).toHaveBeenCalledWith(v);
    });
  });

  test('buffered emits overflow', () => {
    const emittedValues = ['foo', 'bar', 'baz'];
    const overflow = 1;
    const bufferSize = emittedValues.length - overflow;
    const stream = ReplayStream({
      bufferSize,
    });
    emittedValues.forEach((v) => {
      stream.next(v);
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).toHaveBeenCalledTimes(bufferSize);
    emittedValues.slice(overflow).forEach((v) => {
      expect(testSubscriber.next).toHaveBeenCalledWith(v);
    });
  });

  test('no buffer by default', () => {
    const emittedValues = ['foo', 'bar', 'baz'];
    const stream = ReplayStream();
    emittedValues.forEach((v) => {
      stream.next(v);
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).not.toHaveBeenCalled();
  });

  test('empty buffer', () => {
    const stream = ReplayStream({
      bufferSize: 5,
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).not.toHaveBeenCalled();
  });

  test('initial value, buffer', () => {
    const initialValue = 'foo';
    const stream = ReplayStream({
      initialValue,
      bufferSize: 5,
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).toHaveBeenCalledTimes(1);
    expect(testSubscriber.next).toHaveBeenCalledWith(initialValue);
  });

  test('initial value, no buffer', () => {
    const stream = ReplayStream({
      initialValue: 'foo',
      bufferSize: 0,
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).not.toHaveBeenCalled();
  });

  test('initial value, no buffer, debug mode', () => {
    global.__DEBUG__ = true;

    function harnessFn() {
      ReplayStream({
        initialValue: 'foo',
        bufferSize: 0,
      });
    }

    expect(harnessFn).toThrowError('Initial value without buffer');
  });

  test('implicitly undefined initial value', () => {
    const stream = ReplayStream({
      bufferSize: 1,
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).not.toHaveBeenCalled();
  });

  test('explicitly undefined initial value', () => {
    const stream = ReplayStream({
      initialValue: undefined,
      bufferSize: 1,
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).not.toHaveBeenCalled();
  });

  test('null initial value', () => {
    const stream = ReplayStream({
      initialValue: null,
      bufferSize: 1,
    });
    stream.subscribe(testSubscriber);

    expect(testSubscriber.next).toHaveBeenCalledTimes(1);
    expect(testSubscriber.next).toHaveBeenCalledWith(null);
  });
});

describe('asReadOnly', () => {
  test('hidden properties', () => {
    const stream = ReplayStream({
      initialValue: null,
      bufferSize: 1,
    }).asReadOnly();

    expect(stream).not.toHaveProperty('next');
  });
});

function fakeSubscriber() {
  return { next: jest.fn() };
}
