import Subscription from '../subscription';

export default function filter(predicate) {
  return function filterTransformation(subscription) {
    const transformedSubscription = Subscription({
      next: filterValue,
    });

    return transformedSubscription;

    function filterValue(value) {
      const pass = predicate(value);
      if (pass) {
        subscription.next(value);
      }
    }
  };
}
