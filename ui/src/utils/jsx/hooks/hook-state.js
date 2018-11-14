import { Maybe } from 'utils/fp';

import hooksManager from './hooks-manager';
import changeDetector from './change-detector';

/**
 * @template T
 * @typedef {[T, (v: T) => void]} ValueAndSetter
 */

/**
 * @template T
 * @param {T} initialState
 * @returns {ValueAndSetter<T>}
 */
export default function hookState(initialState) {
  const { previousHook } = hooksManager.getCurrentHookCell();

  const valueAndSetter = new Maybe(previousHook)
    .default(() => new StateHook(initialState))
    .map((hook) => (hook instanceof StateHook ? hook : null))
    .map(addStateHook)
    .getRawValue();

  if (!valueAndSetter) {
    throw new Error('Hook mismatch');
  }

  return valueAndSetter;
}

/**
 * @template T
 * @param {StateHook<T>} previousHook
 * @returns {ValueAndSetter<T>}
 */
function addStateHook(previousHook) {
  const state = previousHook.value;
  const stateHook = new StateHook(state);
  const hookTarget = hooksManager.getActiveHooksTarget();
  hooksManager.addHook(stateHook);

  return [state, setState];

  /** @param {T} value */
  function setState(value) {
    stateHook.value = value;
    changeDetector.scheduleUpdate(hookTarget);
  }
}

/**
 * @template T
 */
export class StateHook {
  /** @param {T} value */
  constructor(value) {
    this.value = value;
  }

  cleanup() {}
}
