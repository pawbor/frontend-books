import { noop } from 'utils/fp';

const TypeSymbol = Symbol('subscription');

export default function Subscription(subscriber = { next: noop }) {
  const cleanupList = [];
  let currentNotifier = undefined;

  return {
    [TypeSymbol]: true,
    addCleanup(cleanup) {
      cleanupList.push(cleanup);
    },
    setNotifier(notifier) {
      if (currentNotifier && notifier) {
        throw new Error('Notifier is already set');
      }
      currentNotifier = notifier;
    },
    getNotifier() {
      return currentNotifier;
    },
    getSubscriber() {
      return subscriber;
    },
    next(value) {
      subscriber.next(value);
    },
    unsubscribe() {
      if (!currentNotifier) {
        throw new Error('Not subscribed');
      }

      currentNotifier.unsubscribe(this);
      cleanupList.slice().forEach((cleanup) => cleanup());
    },
  };
}

Subscription.isSubscription = isSubscription;

function isSubscription(subscriber) {
  return !!subscriber && subscriber[TypeSymbol];
}
