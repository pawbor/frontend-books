import Notifier from './notifier';

/**
 * @template SourceT, InternalT
 * @typedef {Object} Privates
 * @prop {import('./types').Stream<SourceT>} source,
 * @prop {import('./types').Transformation<InternalT, SourceT>} transformation
 */

/** @type {WeakMap<ReadOnlyStream<any, any>, Privates<any, any>>} */
const privatesMap = new WeakMap();

/**
 * @template SourceT, InternalT
 * @returns {Privates<SourceT, InternalT>}
 * */
function getPrivates(
  /** @type {ReadOnlyStream<SourceT, InternalT>} */ instance
) {
  const privates = privatesMap.get(instance);
  if (!privates) {
    throw new Error('ReadOnlyStream - Missing privates');
  }
  return privates;
}

/**
 * @template SourceT, InternalT
 */
export default class ReadOnlyStream {
  /**
   * @param {import('./types').Stream<SourceT>} source
   * @param {import('./types').Transformation<InternalT, SourceT>} transformation
   */
  constructor(source, transformation) {
    const privates = {
      source,
      transformation,
    };

    privatesMap.set(this, privates);
  }

  /**
   * @template ExternalT
   * @param {import('./types').Transformation<ExternalT, InternalT>} transformation
   * @returns {import('./types').Stream<ExternalT>}
   */
  transform(transformation) {
    return new ReadOnlyStream(this, transformation);
  }

  /**
   * @param {import('./types').SubscriptionLike<InternalT>} [subscriber]
   * @returns {import('./subscription').default<InternalT>}
   */
  subscribe(subscriber) {
    const { source, transformation } = getPrivates(this);
    const notifier = new Notifier();
    const subscription = notifier.subscribe(subscriber);
    let transformedSubscription = transformation(notifier);
    transformedSubscription = source.subscribe(transformedSubscription);
    subscription.addCleanup(() => {
      transformedSubscription.unsubscribe();
    });
    return subscription;
  }

  /** @returns {import('./subscription').default<InternalT>[]} */
  getSubscriptions() {
    const { source } = getPrivates(this);
    return source.getSubscriptions();
  }
}
