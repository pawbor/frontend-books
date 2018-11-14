import { noop } from 'utils/fp';

import Subscription from './subscription';
import Notifier from './notifier';

describe('Subscription', () => {
  test('with subscriber', () => {
    const subscriber = { next: noop };
    const subscription = new Subscription(subscriber);
    expect(subscription.getSubscriber()).toBe(subscriber);
  });

  test('with default subscriber', () => {
    const subscription = new Subscription();
    expect(subscription.getSubscriber().next).toBe(noop);
  });
});

describe('activate', () => {
  test('connects notifier', () => {
    const { subscription, notifier } = activeSubscription();
    expect(subscription.getNotifier()).toBe(notifier);
  });

  test('fails if active', () => {
    const { subscription } = activeSubscription();
    function harnessFn() {
      const tryNotifier = new Notifier();
      subscription.activate(tryNotifier);
    }
    expect(harnessFn).toThrowError('Not a new subscription');
  });

  test('fails if finished', () => {
    const subscription = finishedSubscription();
    function harnessFn() {
      const tryNotifier = new Notifier();
      subscription.activate(tryNotifier);
    }
    expect(harnessFn).toThrowError('Not a new subscription');
  });
});

describe('finish', () => {
  test('resets notifier', () => {
    const { subscription, notifier } = activeSubscription();
    expect(subscription.getNotifier()).toBe(notifier);
  });

  test('fails if new', () => {
    const subscription = new Subscription();
    function harnessFn() {
      subscription.finish();
    }
    expect(harnessFn).toThrowError('Not an active subscription');
  });

  test('fails if finished', () => {
    const subscription = finishedSubscription();
    function harnessFn() {
      subscription.finish();
    }
    expect(harnessFn).toThrowError('Not an active subscription');
  });
});

describe('unsubscribe', () => {
  function prepare() {
    const { subscription, notifier, cleanupList } = activeSubscription();
    subscription.unsubscribe();
    return { subscription, notifier, cleanupList };
  }

  test('removes itself from notifier', () => {
    const { subscription, notifier } = prepare();
    expect(notifier.getSubscriptions()).not.toContain(subscription);
  });

  test('disconnects notifier', () => {
    const { subscription } = prepare();
    expect(subscription.getNotifier()).toBeUndefined();
  });

  test('Executes cleanup', () => {
    const { cleanupList } = prepare();
    cleanupList.forEach((cleanup) => {
      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  });
});

describe('next', () => {
  test('notifies subscriber', () => {
    const { subscription, subscriber } = activeSubscription();
    const emittedValue = 'foo';
    subscription.next(emittedValue);
    expect(subscriber.next).toHaveBeenCalledTimes(1);
    expect(subscriber.next).toHaveBeenCalledWith(emittedValue);
  });

  test('fails if new', () => {
    const subscription = new Subscription();
    const emittedValue = 'foo';
    function harnessFn() {
      subscription.next(emittedValue);
    }
    expect(harnessFn).toThrowError('Not an active subscription');
  });

  test('fails if finished', () => {
    const subscription = finishedSubscription();
    const emittedValue = 'foo';
    function harnessFn() {
      subscription.next(emittedValue);
    }
    expect(harnessFn).toThrowError('Not an active subscription');
  });
});

describe('addCleanup', () => {
  test('finished subscription calls cleanup immediately', () => {
    const subscription = finishedSubscription();
    const cleanUp = jest.fn();
    subscription.addCleanup(cleanUp);
    expect(cleanUp).toHaveBeenCalledTimes(1);
  });
});

function activeSubscription() {
  const notifier = new Notifier();
  const subscriber = { next: jest.fn() };
  const subscription = new Subscription(subscriber);
  subscription.activate(notifier);
  const cleanupList = Array.from({ length: 5 }, () => jest.fn());
  cleanupList.forEach((cleanup) => {
    subscription.addCleanup(cleanup);
  });
  return { subscription, notifier, subscriber, cleanupList };
}

function finishedSubscription() {
  const { subscription } = activeSubscription();
  subscription.finish();
  return subscription;
}
