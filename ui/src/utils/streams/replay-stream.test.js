import { withoutElement } from 'utils/array';

import ReplayStream from './replay-stream';

describe('next', () => {
  test('single emit', () => {
    const emittedValue = 'foo';

    const stream = new ReplayStream();
    const subscribers = Array.from({ length: 5 }, () => {
      const subscriber = fakeSubscriber();
      stream.subscribe(subscriber);
      return subscriber;
    });
    stream.next(emittedValue);

    subscribers.forEach((subscriber) => {
      expect(subscriber.next).toHaveBeenCalledTimes(1);
      expect(subscriber.next).toHaveBeenCalledWith(emittedValue);
    });
  });

  test('buffered emits', () => {
    const emittedValues = ['foo', 'bar', 'baz'];

    const stream = new ReplayStream({
      bufferSize: emittedValues.length,
    });
    emittedValues.forEach((v) => {
      stream.next(v);
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).toHaveBeenCalledTimes(emittedValues.length);
    emittedValues.forEach((v) => {
      expect(subscriber.next).toHaveBeenCalledWith(v);
    });
  });

  test('buffered emits overflow', () => {
    const emittedValues = ['foo', 'bar', 'baz'];
    const overflow = 1;
    const bufferSize = emittedValues.length - overflow;

    const stream = new ReplayStream({
      bufferSize,
    });
    emittedValues.forEach((v) => {
      stream.next(v);
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).toHaveBeenCalledTimes(bufferSize);
    emittedValues.slice(overflow).forEach((v) => {
      expect(subscriber.next).toHaveBeenCalledWith(v);
    });
  });

  test('no buffer by default', () => {
    const emittedValues = ['foo', 'bar', 'baz'];

    const stream = new ReplayStream();
    emittedValues.forEach((v) => {
      stream.next(v);
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
  });
});

describe('subscribe', () => {
  test('empty buffer', () => {
    const stream = new ReplayStream({
      bufferSize: 5,
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
  });

  test('initial value, buffer', () => {
    const initialValue = 'foo';
    
    const stream = new ReplayStream({
      initialValue,
      bufferSize: 5,
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).toHaveBeenCalledTimes(1);
    expect(subscriber.next).toHaveBeenCalledWith(initialValue);
  });

  test('initial value, no buffer', () => {
    const stream = new ReplayStream({
      initialValue: 'foo',
      bufferSize: 0,
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
  });

  test('initial value, no buffer, debug mode', () => {
    __DEBUG__ = true;

    function harnessFn() {
      new ReplayStream({
        initialValue: 'foo',
        bufferSize: 0,
      });
    }

    expect(harnessFn).toThrowError('Initial value without buffer');
  });

  test('implicitly undefined initial value', () => {
    const stream = new ReplayStream({
      bufferSize: 1,
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
  });

  test('explicitly undefined initial value', () => {
    const stream = new ReplayStream({
      initialValue: undefined,
      bufferSize: 1,
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).not.toHaveBeenCalled();
  });

  test('null initial value', () => {
    const stream = new ReplayStream({
      initialValue: null,
      bufferSize: 1,
    });
    const subscriber = fakeSubscriber();
    stream.subscribe(subscriber);

    expect(subscriber.next).toHaveBeenCalledTimes(1);
    expect(subscriber.next).toHaveBeenCalledWith(null);
  });
});

describe('asReadOnly', () => {
  test('next is hidden', () => {
    const stream = new ReplayStream({
      initialValue: null,
      bufferSize: 1,
    }).asReadOnly();

    expect(stream).not.toHaveProperty('next');
  });

  test('emits like the source stream', () => {
    const sourceStream = new ReplayStream({ initialValue: 1, bufferSize: 2 });
    const readOnlyStream = sourceStream.asReadOnly();
    const subscriber = fakeSubscriber();

    sourceStream.next(2);
    sourceStream.next(3);
    const subscription = readOnlyStream.subscribe(subscriber);
    sourceStream.next(4);
    subscription.unsubscribe();
    sourceStream.next(5);

    expect(subscriber.next).toHaveBeenCalledTimes(3);
    expect(subscriber.next).toHaveBeenCalledWith(2);
    expect(subscriber.next).toHaveBeenCalledWith(3);
    expect(subscriber.next).toHaveBeenCalledWith(4);
  });
});

test('unsubscribe', () => {
  const emittedBefore = 'foo';
  const emittedAfter = 'bar';

  const stream = new ReplayStream();

  const subscriptions = Array.from({ length: 5 }, () => {
    const subscription = stream.subscribe();
    jest.spyOn(subscription, 'next');
    return subscription;
  });

  const chosenSubscription = subscriptions[2];
  const otherSubscriptions = withoutElement(subscriptions, chosenSubscription);

  stream.next(emittedBefore);
  chosenSubscription.unsubscribe();
  stream.next(emittedAfter);

  expect(chosenSubscription.next).toHaveBeenCalledTimes(1);
  expect(chosenSubscription.next).toHaveBeenCalledWith(emittedBefore);

  otherSubscriptions.forEach((sub) => {
    expect(sub.next).toHaveBeenCalledTimes(2);
  });
});

function fakeSubscriber() {
  return { next: jest.fn() };
}
