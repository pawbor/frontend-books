import { withoutElement } from 'utils/array';
import { noop } from 'utils/fp';

import Subscription from './subscription';
import Notifier from './notifier';

describe('subscribe', () => {
  test('adds empty subscription', () => {
    const notifier = new Notifier();
    const sub = notifier.subscribe();
    expect(notifier.getSubscriptions()).toEqual([sub]);
    expect(sub.getNotifier()).toBe(notifier);
  });

  test('adds subscription with subscriber', () => {
    const subscriber = { next: noop };
    const notifier = new Notifier();
    const sub = notifier.subscribe(subscriber);
    expect(sub.getSubscriber()).toBe(subscriber);
  });
});

describe('unsubscribe', () => {
  test('removes subscription', () => {
    const { notifier, subscriptions } = prepareNotifierWithSubscriptions();
    const chosenSubscription = subscriptions[2];
    const otherSubscription = withoutElement(subscriptions, chosenSubscription);

    notifier.unsubscribe(chosenSubscription);
    expect(chosenSubscription.getNotifier()).toBeUndefined();
    expect(notifier.getSubscriptions()).toEqual(otherSubscription);
  });

  describe('not subscribed', () => {
    test('throws error', () => {
      const { notifier } = prepareNotifierWithSubscriptions();
      const subscription = new Subscription();

      function harnessFn() {
        notifier.unsubscribe(subscription);
      }
      expect(harnessFn).toThrowError('Not subscribed here');
    });
  });
});

describe('next', () => {
  test('notifies all subscriptions', () => {
    const { notifier, subscriptions } = prepareNotifierWithSubscriptions();
    const emittedValue = 'foo';
    notifier.next(emittedValue);
    subscriptions.forEach((sub) => {
      expect(sub.next).toHaveBeenCalledTimes(1);
      expect(sub.next).toHaveBeenCalledWith(emittedValue);
    });
  });
});

function prepareNotifierWithSubscriptions() {
  const notifier = new Notifier();
  const subscriptions = Array.from({ length: 5 }, () => {
    const sub = notifier.subscribe();
    jest.spyOn(sub, 'next');
    return sub;
  });

  return { notifier, subscriptions };
}
