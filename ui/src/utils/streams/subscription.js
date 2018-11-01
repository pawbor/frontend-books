import { noop } from 'utils/fp';

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {import('./types').Subscriber<T>} subscriber
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

/**
 * @template T
 */
export default class Subscription {
  constructor(/** @type {import('./types').Subscriber<T>} */ subscriber = { next: noop }) {
    const privates = {
      subscriber,
      cleanupList: [],
      notifier: undefined,
    };

    privatesMap.set(this, privates);
  }

  addCleanup(/**@type {Function} */ cleanup) {
    getPrivates(this).cleanupList.push(cleanup);
  }

  setNotifier(/**@type {import('./notifier').default<T> | undefined} */ notifier) {
    const privates = getPrivates(this);
    if (privates.notifier && notifier) {
      throw new Error('Notifier is already set');
    }
    privates.notifier = notifier;
  }

  /** @returns {import('./notifier').default<T> | undefined} */
  getNotifier() {
    return getPrivates(this).notifier;
  }

  /** @returns {import('./types').Subscriber<T>} */
  getSubscriber() {
    return getPrivates(this).subscriber;
  }

  next(/** @type {T} */ value) {
    getPrivates(this).subscriber.next(value);
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
