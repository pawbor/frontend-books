import { BufferedStream } from 'utils/observable';

/**
 * @template T
 * @typedef {Object} Privates
 * @prop {T} currentState,
 * @prop {BufferedStream<T>} currentStateStream
 */

/** @type {WeakMap<Store<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Store<T>} */ instance) {
  const privates = privatesMap.get(instance);
  if (!privates) {
    throw new Error('Store - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
export default class Store {
  /**
   * @param {Object} param0
   * @param {T} param0.initialState
   */
  constructor({ initialState }) {
    const privates = {
      currentState: initialState,
      currentStateStream: new BufferedStream(1, [initialState]),
    };

    privatesMap.set(this, privates);
  }

  /**
   * @param {T} newState
   */
  setState(newState) {
    const privates = getPrivates(this);
    privates.currentState = newState;
    privates.currentStateStream.next(newState);
  }

  /**
   * @returns {T}
   */
  getState() {
    return getPrivates(this).currentState;
  }

  /**
   * @returns {import('utils/observable').Observable<T>}
   */
  stateStream() {
    return getPrivates(this).currentStateStream.asReadOnly();
  }
}
