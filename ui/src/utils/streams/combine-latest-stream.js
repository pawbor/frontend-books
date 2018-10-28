import ReplayStream from './replay-stream';
import Subscription from './subscription';

export default function CombineLatestStream(streamsMap) {
  return ReplayStream({ initialValue: streamsMap, bufferSize: 1 }).transform(
    combineLatestTransformation
  );
}

const Empty = Symbol('empty');

function combineLatestTransformation(subscription) {
  let noEmptyValues = false;

  const transformedSubscription = Subscription({
    next: subscribeToStreams,
  });

  return transformedSubscription;

  function subscribeToStreams(streamsMap) {
    const combinedValues = initialCombinedValues(streamsMap);

    Object.entries(streamsMap)
      .map(([key, stream]) =>
        stream.subscribe({
          next: propertyUpdater(combinedValues, key),
        })
      )
      .forEach((subscription) => {
        transformedSubscription.connect(subscription);
      });
  }

  function initialCombinedValues(streamsMap) {
    return Object.keys(streamsMap).reduce(addEmptyProperty, {});
  }

  function addEmptyProperty(target, propertyName) {
    target[propertyName] = Empty;
    return target;
  }

  function propertyUpdater(target, propertyName) {
    return function updateWith(value) {
      target[propertyName] = value;
      noEmptyValues = noEmptyValues || hasNoEmptyValues(target);
      if (noEmptyValues) {
        emitCombinedValues(target);
      }
    };
  }

  function hasNoEmptyValues(target) {
    return Object.values(target).every((v) => v !== Empty);
  }

  function emitCombinedValues(combinedValues) {
    const copy = Object.assign({}, combinedValues);
    subscription.next(copy);
  }
}
