import Subscription from '../subscription';

/**
 * @template T, R
 * @param {import('utils/fp/types').Mapping<T, R>} mapping
 */
export default function map(mapping) {
  return mapTransformation;

  /**
   * @type {import('../types').Transformation<R, T>}
   */
  function mapTransformation(subscription) {
    const transformedSubscription = new Subscription({
      next: mapValue,
    });

    /**
     * @param {T} value
     */
    function mapValue(value) {
      const transformedValue = mapping(value);
      subscription.next(transformedValue);
    }

    return transformedSubscription;
  }
}
