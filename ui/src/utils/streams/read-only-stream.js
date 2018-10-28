import { identity } from 'utils/fp';
import Subscription from './subscription';

export default function ReadOnlyStream(source, transformation = identity) {
  return {
    transform(transformation) {
      return ReadOnlyStream(this, transformation);
    },

    subscribe(subscriber) {
      const subscription = Subscription(subscriber);
      const transformedSubscription = transformation(subscription);
      return source.subscribe(transformedSubscription);
    },
  };
}
