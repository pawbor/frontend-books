import { noop } from 'utils/fp';
import { removeElement } from 'utils/array';

const TypeSymbol = Symbol('subscription');

export default function Subscription(subscriber = { next: noop }) {
  const children = [];
  let currentNotifier = undefined;
  let parent = undefined;

  return {
    [TypeSymbol]: true,
    connect(subscription) {
      children.push(subscription);
      subscription.setParent(this);
    },
    disconnect(subscription) {
      if (subscription.getParent() !== this) {
        throw new Error('No parent-child relation');
      }
      removeElement(children, subscription);
      subscription.setParent(undefined);
    },
    setParent(subscription) {
      if (parent && subscription) {
        throw new Error('Parent is already set');
      }
      parent = subscription;
    },
    getParent() {
      return parent;
    },
    getChildren() {
      return children.slice();
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

      if (parent) {
        parent.disconnect(this);
      }
      currentNotifier.unsubscribe(this);
      children.slice().forEach((child) => child.unsubscribe());
    },
  };
}

Subscription.isSubscription = isSubscription;

function isSubscription(subscriber) {
  return !!subscriber && subscriber[TypeSymbol];
}
