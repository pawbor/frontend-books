import { withoutElement } from 'utils/array';
import Subscription from './subscription';

/**
 * @template T
 * @typedef {Object} Privates<T>
 * @prop {Subscription<T>[]} subscriptions
 */

/** @type {WeakMap<Notifier<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Notifier<T>} */ notifier) {
  const privates = privatesMap.get(notifier);
  if (!privates) {
    throw new Error('Notifier - Missing privates');
  }
  return privates;
}

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

  /** @param {import('./types').SubscriptionLike<T>} [subscriber]*/
  subscribe(subscriber) {
    const subscription = Subscription.isSubscription(subscriber)
      ? subscriber
      : new Subscription(subscriber);
    const privates = getPrivates(this);
    privates.subscriptions = [...privates.subscriptions, subscription];
    subscription.activate(this);
    return subscription;
  }

  /** @param {Subscription<T>} subscription*/
  unsubscribe(subscription) {
    if (subscription.getNotifier() !== this) {
      throw new Error('Not subscribed here');
    }

    const privates = getPrivates(this);
    privates.subscriptions = withoutElement(
      this.getSubscriptions(),
      subscription
    );
    subscription.finish();
  }

  /** @returns {Subscription<T>[]} */
  getSubscriptions() {
    return getPrivates(this).subscriptions.slice();
  }

  next(/** @type {T} */ value) {
    this.getSubscriptions().forEach((s) => s.next(value));
  }
}
