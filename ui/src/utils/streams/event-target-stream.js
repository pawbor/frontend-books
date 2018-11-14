import ReplayStream from './replay-stream';
import Subscription from './subscription';

/**
 * @typedef {Object} InternalConfig
 * @prop {EventTarget} eventTarget
 * @prop {string} type
 * @prop {AddEventListenerOptions | boolean | undefined} options
 */

/**
 * @param {EventTarget} eventTarget
 * @param {string} type
 * @param {AddEventListenerOptions | boolean | undefined} [options]
 * @returns {import('./types').Stream<Event>}
 */
export default function EventTargetStream(eventTarget, type, options) {
  return new ReplayStream({
    initialValue: { eventTarget, type, options },
    bufferSize: 1,
  }).transform(eventTargetTransformation);
}

/**
 * @type {import('./types').Transformation<Event, InternalConfig>}
 */
function eventTargetTransformation(subscription) {
  const transformedSubscription = new Subscription({
    next: attachListener,
  });

  return transformedSubscription;

  /**
   * @param {InternalConfig} param0
   */
  function attachListener({ eventTarget, type, options }) {
    eventTarget.addEventListener(type, listener, options);
    transformedSubscription.addCleanup(() =>
      eventTarget.removeEventListener(type, listener, options)
    );
  }

  /** @param {Event} event */
  function listener(event) {
    subscription.next(event);
  }
}
