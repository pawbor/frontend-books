import ReplayStream from './replay-stream';
import Subscription from './subscription';

/**
 * @template T
 * @param {T[]} array
 * @returns {import('./types').Stream<T>}
 */
export default function ArrayStream(array) {
  return new ReplayStream({ initialValue: array, bufferSize: 1 }).transform(
    arrayTransformation
  );
}

/**
 * @template T
 * @type {import('./types').Transformation<T, T[]>}
 */
function arrayTransformation(subscription) {
  const transformedSubscription = new Subscription({
    next: emitAllElements,
  });
  return transformedSubscription;

  /** @param {T[]} array */
  function emitAllElements(array) {
    array.forEach((value) => subscription.next(value));
  }
}
