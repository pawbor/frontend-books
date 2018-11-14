import { noop } from 'utils/fp';

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {import('./types').Subscriber<T>} subscriber
 * @prop {SubscriptionState} state
 * @prop {Array<Function>} cleanupList
 * @prop {import('./notifier').default<T> | undefined} notifier
 */

/** @type {WeakMap<Subscription<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Subscription<T>} */ subscription) {
  const privates = privatesMap.get(subscription);
  if (!privates) {
    throw new Error('Subscription - Missing privates');
  }
  return privates;
}

/** @enum {string} */
const SubscriptionState = {
  New: 'new',
  Active: 'active',
  Finished: 'finished',
};

/**
 * @template T
 */
export default class Subscription {
  /**
   * @param {import('./types').Subscriber<T>} subscriber
   */
  constructor(subscriber = { next: noop }) {
    const privates = {
      subscriber,
      state: SubscriptionState.New,
      cleanupList: [],
      notifier: undefined,
    };

    privatesMap.set(this, privates);
  }

  /** @param {Function} cleanup */
  addCleanup(cleanup) {
    const privates = getPrivates(this);
    if (privates.state !== SubscriptionState.Finished) {
      privates.cleanupList.push(cleanup);
    } else {
      cleanup();
    }
  }

  /** @param {import('./notifier').default<T>} notifier */
  activate(notifier) {
    const privates = getPrivates(this);
    if (privates.state !== SubscriptionState.New) {
      throw new Error('Not a new subscription');
    }
    privates.state = SubscriptionState.Active;
    privates.notifier = notifier;
  }

  finish() {
    const privates = getPrivates(this);
    if (privates.state !== SubscriptionState.Active) {
      throw new Error('Not an active subscription');
    }
    privates.state = SubscriptionState.Finished;
    privates.notifier = undefined;
  }

  /** @returns {import('./notifier').default<T> | undefined} */
  getNotifier() {
    return getPrivates(this).notifier;
  }

  /** @returns {import('./types').Subscriber<T>} */
  getSubscriber() {
    return getPrivates(this).subscriber;
  }

  /** @param {T} value*/
  next(value) {
    const privates = getPrivates(this);
    if (privates.state !== SubscriptionState.Active) {
      throw new Error('Not an active subscription');
    }
    privates.subscriber.next(value);
  }

  unsubscribe() {
    const { notifier, cleanupList } = getPrivates(this);
    if (!notifier) {
      throw new Error('Not subscribed');
    }

    notifier.unsubscribe(this);
    cleanupList.slice().forEach((cleanup) => cleanup());
  }

  /**
   * @template T
   * @param {import('./types').Subscriber<T> | undefined} subscriber
   * @returns {subscriber is Subscription<T>}
   */
  static isSubscription(subscriber) {
    return subscriber instanceof Subscription;
  }
}
