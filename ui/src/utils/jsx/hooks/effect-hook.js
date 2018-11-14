import { Maybe } from 'utils/fp';

export default class EffectHook {
  /**
   * @param {import("./types").Effect} effect
   * @param {any[] | undefined} changeIndicators
   */
  constructor(effect, changeIndicators) {
    this.effect = effect;
    this.cleanedUp = false;
    this.effectCleanup = undefined;
    this.changeIndicators = changeIndicators;
  }

  invokeEffect() {
    if (!this.cleanedUp) {
      this.effectCleanup = this.effect();
    }
  }

  cleanup() {
    this.cleanedUp = true;
    new Maybe(this.effectCleanup).do((cleanup) => cleanup());
  }
}
