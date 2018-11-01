import { identity } from 'utils/fp';

import Notifier from './notifier';
import ReadOnlyStream from './read-only-stream';

/**
 * @template T
 * @typedef {Object} Params
 * @property {T} [initialValue]
 * @property {number} [bufferSize]
 */

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {Notifier<T>} notifier,
 * @prop {T[]} buffer
 * @prop {number} bufferSize
 */

/** @type {WeakMap<ReplayStream<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {ReplayStream<T>} */ instance) {
  const privates = privatesMap.get(instance);
  if (!privates) {
    throw new Error('ReplayStream - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
export default class ReplayStream {
  /**
   * @param {Params<T>} param0
   */
  constructor({ initialValue, bufferSize = 0 } = {}) {
    /** @type {Notifier<T>} */
    const notifier = new Notifier();

    if (__DEBUG__) {
      validateInitialValueAndBuffer(initialValue, bufferSize);
    }

    const buffer = [];

    if (bufferSize > 0 && initialValue !== undefined) {
      buffer.push(initialValue);
    }

    const privates = {
      notifier,
      buffer,
      bufferSize,
    };

    privatesMap.set(this, privates);
  }

  /**
   * @param {import('./types').Subscriber<T> | undefined} [subscriber]
   * @returns {import('./subscription').default<T>}
   */
  subscribe(subscriber) {
    const { buffer, notifier } = getPrivates(this);
    const subscription = notifier.subscribe(subscriber);
    buffer.forEach((value) => subscription.next(value));
    return subscription;
  }

  /** @param {T} value */
  next(value) {
    const { buffer, bufferSize, notifier } = getPrivates(this);
    buffer.push(value);
    if (bufferSize < buffer.length) {
      buffer.shift();
    }
    notifier.notify(value);
  }

  // TODO: error handling

  // TODO: It should be possible to complete a stream.
  // Reminder: Notifier should unsubscribe all subscriptions when stream completes

  /**
   * @template R
   * @param {import('./types').Transformation<R, T>} transformation
   * @returns {import('./types').Stream<R>}
   */
  transform(transformation) {
    return new ReadOnlyStream(this, transformation);
  }

  /** @returns {import('./types').Stream<T>} */
  asReadOnly() {
    return new ReadOnlyStream(this, identity);
  }

  /**
   * @returns {import('./subscription').default<T>[]}
   */
  getSubscriptions() {
    const { notifier } = getPrivates(this);
    return notifier.getSubscriptions();
  }
}

/**
 * @template T
 * @param {T | undefined} initialValue
 * @param {number} bufferSize
 */
function validateInitialValueAndBuffer(initialValue, bufferSize) {
  if (initialValue !== undefined && bufferSize < 1) {
    throw new Error('Initial value without buffer');
  }
}
