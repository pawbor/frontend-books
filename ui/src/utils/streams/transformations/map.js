import Subscription from '../subscription';

export default function map(mapping) {
  return function mapTransformation(subscription) {
    const transformedSubscription = Subscription({
      next: (value) => {
        const transformedValue = mapping(value);
        subscription.next(transformedValue);
      },
    });

    return transformedSubscription;
  };
}
