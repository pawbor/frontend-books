import Subscription from '../subscription';

/**
 * @template T
 * @param {import('utils/fp/types').Predicate<T>} predicate
 */
export default function filter(predicate) {
  return filterTransformation;

  /**
   * @type {import('../types').Transformation<T, T>}
   */
  function filterTransformation(subscription) {
    const transformedSubscription = new Subscription({
      next: filterValue,
    });

    return transformedSubscription;

    /**
     * @param {T} value
     */
    function filterValue(value) {
      const pass = predicate(value);
      if (pass) {
        subscription.next(value);
      }
    }
  }
}
