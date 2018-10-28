import { removeElement } from 'utils/array';
import Subscription from './subscription';

export default function Notifier() {
  const subscriptions = [];

  return {
    subscribe(subscriber) {
      const subscription = Subscription.isSubscription(subscriber)
        ? subscriber
        : Subscription(subscriber);
      subscriptions.push(subscription);
      subscription.setNotifier(this);
      return subscription;
    },
    unsubscribe(subscription) {
      if (subscription.getNotifier() !== this) {
        throw new Error('Not subscribed here');
      }

      removeElement(subscriptions, subscription);
      subscription.setNotifier(undefined);
    },
    getSubscriptions() {
      return subscriptions.slice();
    },
    notify(value) {
      subscriptions.forEach((s) => s.next(value));
    },
  };
}
