import { removeElement } from 'utils/array';
import Subscription from './subscription';

/**
 * @template T
 * @typedef {Object} Privates<T>
 * @prop {Subscription<T>[]} subscriptions
 */

/** @type {WeakMap<Notifier<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/**
 * @template T
 */
export default class Notifier {
  constructor() {
    const privates = {
      subscriptions: [],
    };

    privatesMap.set(this, privates);
  }

  /** @param {import('./types').Subscriber<T> | undefined} [subscriber]*/
  subscribe(subscriber) {
    const subscription = Subscription.isSubscription(subscriber)
      ? subscriber
      : new Subscription(subscriber);
    subscriptions(this).push(subscription);
    subscription.setNotifier(this);
    return subscription;
  }

  /** @param {Subscription<T>} subscription*/
  unsubscribe(subscription) {
    if (subscription.getNotifier() !== this) {
      throw new Error('Not subscribed here');
    }

    removeElement(subscriptions(this), subscription);
    subscription.setNotifier(undefined);
  }

  /** @returns {Subscription<T>[]} */
  getSubscriptions() {
    return subscriptions(this).slice();
  }

  notify(/** @type {T} */ value) {
    subscriptions(this).forEach((s) => s.next(value));
  }
}

/** @template T @returns {Subscription<T>[]} */
function subscriptions(/** @type {Notifier<T>} */ notifier) {
  const privates = privatesMap.get(notifier);
  if (!privates) {
    throw new Error('Notifier - Missing privates');
  }
  return privates.subscriptions;
}
