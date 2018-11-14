import Subscription from '../subscription';

/**
 * @template T
 * @param {import('utils/fp/types').Predicate<T>} [predicate]
 */
export default function first(predicate = () => true) {
  return filterTransformation;

  /**
   * @type {import('../types').Transformation<T, T>}
   */
  function filterTransformation(subscription) {
    const transformedSubscription = new Subscription({
      next: filterAndUnsubscribeOnMatch,
    });

    return transformedSubscription;

    /**
     * @param {T} value
     */
    function filterAndUnsubscribeOnMatch(value) {
      const pass = predicate(value);
      if (pass) {
        transformedSubscription.unsubscribe();
        subscription.next(value);
      }
    }
  }
}
