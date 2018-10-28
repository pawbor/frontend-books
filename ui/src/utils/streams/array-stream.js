import ReplayStream from './replay-stream';
import Subscription from './subscription';

export default function ArrayStream(array) {
  return ReplayStream({ initialValue: array, bufferSize: 1 }).transform(
    arrayTransformation
  );
}

function arrayTransformation(subscription) {
  const transformedSubscription = Subscription({
    next: (array) => array.forEach((value) => subscription.next(value)),
  });
  return transformedSubscription;
}
