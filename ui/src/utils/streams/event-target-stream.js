import ReplayStream from './replay-stream';
import Subscription from './subscription';

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
 * @param {Subscription<Event>} subscription
 */
function eventTargetTransformation(subscription) {
  const transformedSubscription = new Subscription({
    next: attachListener,
  });

  return transformedSubscription;

  /**
   *
   * @param {Object} param0
   * @param {EventTarget} param0.eventTarget
   * @param {string} param0.type
   * @param {AddEventListenerOptions | boolean | undefined} param0.options
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
