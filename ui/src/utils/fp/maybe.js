/**
 * @template T
 * @typedef {Object} Privates
 * @prop {Maybe<T>} implementation
 */

/** @type {WeakMap<Maybe<any>, Privates<any>>} */
const privatesMap = new WeakMap();

/** @template T @returns {Privates<T>} */
function getPrivates(/** @type {Maybe<T>} */ option) {
  const privates = privatesMap.get(option);
  if (!privates) {
    throw new Error('Option - Missing privates');
  }
  return privates;
}

/**
 * @template T
 */
class Maybe {
  /**
   * @param {T | null | undefined} value
   */
  constructor(value) {
    /** @type {Maybe<T>} */
    let implementation;

    if (value === null || value === undefined) {
      implementation = Nothing();
    } else {
      implementation = Something(value);
    }

    privatesMap.set(this, { implementation });
  }

  /**
   * @template R
   * @param {R} [defaultValue]
   * @returns {T|R}
   */
  getValue(defaultValue) {
    const { implementation } = getPrivates(this);
    return implementation.getValue(defaultValue);
  }

  /**
   * @template R
   * @param {import('utils/fp/types').Mapping<T, R | null>} mapping
   * @returns {Maybe<R>}
   */
  map(mapping) {
    const { implementation } = getPrivates(this);
    return implementation.map(mapping);
  }

  /**
   * @template R
   * @param {import('utils/fp/types').Mapping<T, Maybe<R>>} mapping
   * @returns {Maybe<R>}
   */
  flatMap(mapping) {
    const { implementation } = getPrivates(this);
    return implementation.flatMap(mapping);
  }
}

/**
 * @template T
 * @param {T} value
 */
function Something(value) {
  return {
    getValue() {
      return value;
    },

    /**
     * @template R
     * @param {import('utils/fp/types').Mapping<T, R | null>} mapping
     * @returns {Maybe<R>}
     */
    map(mapping) {
      const mappedValue = mapping(value);
      return new Maybe(mappedValue);
    },

    /**
     * @template R
     * @param {import('utils/fp/types').Mapping<T, Maybe<R>>} mapping
     * @returns {Maybe<R>}
     */
    flatMap(mapping) {
      const mappedValue = mapping(value);
      return mappedValue;
    },
  };
}

/**
 * @type {Maybe<any>}
 */
const nothing = {
  getValue(defaultValue) {
    return defaultValue;
  },
  map() {
    return Nothing();
  },
  flatMap() {
    return Nothing();
  },
};

function Nothing() {
  return nothing;
}

export { Maybe as default };
