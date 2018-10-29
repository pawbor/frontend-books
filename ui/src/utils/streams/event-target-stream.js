import ReplayStream from './replay-stream';
import Subscription from './subscription';

export default function EventTargetStream(eventTarget, type, options) {
  return ReplayStream({
    initialValue: { eventTarget, type, options },
    bufferSize: 1,
  }).transform(eventTargetTransformation);
}

function eventTargetTransformation(subscription) {
  const transformedSubscription = Subscription({
    next: attachListener,
  });

  return transformedSubscription;

  function attachListener({ eventTarget, type, options }) {
    eventTarget.addEventListener(type, listener, options);
    transformedSubscription.addCleanup(() =>
      eventTarget.removeEventListener(type, listener, options)
    );
  }

  function listener(event) {
    subscription.next(event);
  }
}
