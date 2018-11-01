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
    expect(subscription.getSubscriber()).toHaveProperty('next');
  });
});

describe('setNotifier', () => {
  test('sets notifier', () => {
    const notifier = new Notifier();
    const sub = new Subscription();
    sub.setNotifier(notifier);
    expect(sub.getNotifier()).toBe(notifier);
  });

  test('fails if has notofier', () => {
    const notifier = new Notifier();
    const sub = new Subscription();
    sub.setNotifier(notifier);
    function harnessFn() {
      const tryNotifier = new Notifier();
      sub.setNotifier(tryNotifier);
    }
    expect(harnessFn).toThrowError('Notifier is already set');
  });
});

describe('unsubscribe', () => {
  test('unsubscribes from notifier', () => {
    const notifier = new Notifier();
    const sub = notifier.subscribe();
    sub.unsubscribe();
    expect(sub.getNotifier()).toBeUndefined();
    expect(notifier.getSubscriptions()).not.toContain(sub);
  });

  test('Executes cleanup', () => {
    const notifier = new Notifier();
    const sub = notifier.subscribe();
    const cleanupList = Array.from({ length: 5 }, () => jest.fn());
    cleanupList.forEach((cleanup) => {
      sub.addCleanup(cleanup);
    });
    sub.unsubscribe();
    cleanupList.forEach((cleanup) => {
      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  });
});

describe('next', () => {
  test('notifies subscriber', () => {
    const next = jest.fn();
    const subscription = new Subscription({ next });
    const emittedValue = 'foo';
    subscription.next(emittedValue);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(emittedValue);
  });

  describe('no subscriber', () => {
    test("won't fail", () => {
      const subscription = new Subscription();
      const emittedValue = 'foo';
      function harnessFn() {
        subscription.next(emittedValue);
      }
      expect(harnessFn).not.toThrowError();
    });
  });
});
