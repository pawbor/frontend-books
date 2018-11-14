import ReplayStream from './replay-stream';
import Subscription from './subscription';

/**
 * @template {string} KeysT
 * @param {Record<KeysT, import('./types').Stream<any>>} streamsMap
 * @returns {import('./types').Stream<{[P in KeysT]: any}>}
 */
export default function CombineLatestStream(streamsMap) {
  return new ReplayStream({
    initialValue: streamsMap,
    bufferSize: 1,
  }).transform(combineLatestTransformation);
}

const Empty = Symbol('empty');

/**
 * @template {string} KeysT
 * @type {import('./types').Transformation<{[P in KeysT]: any}, Record<KeysT, import('./types').Stream<any>>>}
 */
function combineLatestTransformation(subscription) {
  /** @typedef {Record<KeysT, import('./types').Stream<any>>} Input */
  /** @typedef {{[P in KeysT]: any}} Result */

  let noEmptyValues = false;

  const transformedSubscription = new Subscription({
    next: subscribeToStreams,
  });

  return transformedSubscription;

  /** @param {Input} streamsMap */
  function subscribeToStreams(streamsMap) {
    const combinedValues = initialCombinedValues(streamsMap);

    Object.entries(streamsMap)
      .map(([key, stream]) =>
        stream.subscribe({
          next: propertyUpdater(combinedValues, key),
        })
      )
      .forEach((subscription) => {
        transformedSubscription.addCleanup(() => subscription.unsubscribe());
      });
  }

  /**
   * @param {Input} streamsMap
   * @returns {Result}
   */
  function initialCombinedValues(streamsMap) {
    return Object.keys(streamsMap).reduce(addEmptyProperty, {});
  }

  /**
   * @param {any} target
   * @param {string} propertyName
   */
  function addEmptyProperty(target, propertyName) {
    target[propertyName] = Empty;
    return target;
  }

  /**
   * @param {any} target
   * @param {string} propertyName
   */
  function propertyUpdater(target, propertyName) {
    return updatePropertyWith;

    /** @param {any} value  */
    function updatePropertyWith(value) {
      target[propertyName] = value;
      noEmptyValues = noEmptyValues || hasNoEmptyValues(target);
      if (noEmptyValues) {
        emitCombinedValues(target);
      }
    }
  }

  /**
   * @param {any} combinedValues
   * @returns {combinedValues is Result}
   */
  function hasNoEmptyValues(combinedValues) {
    return Object.values(combinedValues).every((v) => v !== Empty);
  }

  /**
   * @param {Result} combinedValues
   */
  function emitCombinedValues(combinedValues) {
    const copy = Object.assign({}, combinedValues);
    subscription.next(copy);
  }
}
