import Notifier from './notifier';
import ReadOnlyStream from './read-only-stream';

export default function ReplayStream({ initialValue, bufferSize = 0 } = {}) {
  const notifier = Notifier();

  if (__DEBUG__) {
    validateInitialValueAndBuffer(initialValue, bufferSize);
  }

  const buffer = [];
  if (bufferSize > 0 && initialValue !== undefined) {
    buffer.push(initialValue);
  }

  return {
    subscribe(subscriber) {
      const subscription = notifier.subscribe(subscriber);
      buffer.forEach((value) => subscription.next(value));
      return subscription;
    },

    next(value) {
      buffer.push(value);
      if (bufferSize < buffer.length) {
        buffer.shift();
      }
      notifier.notify(value);
    },

    // TODO: error handling

    // TODO: It should be possible to complete a stream.
    // Reminder: Notifier should unsubscribe all subscriptions when stream completes

    transform(transformation) {
      return ReadOnlyStream(this, transformation);
    },

    asReadOnly() {
      return ReadOnlyStream(this);
    },

    getSubscriptions() {
      return notifier.getSubscriptions()
    }
  };
}

function validateInitialValueAndBuffer(initialValue, bufferSize) {
  if (initialValue !== undefined && bufferSize < 1) {
    throw new Error('Initial value without buffer');
  }
}
