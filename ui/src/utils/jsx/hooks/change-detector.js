import { Maybe } from 'utils/fp';
import renderQueue from './render-queue';

/** @type {WeakMap<import('./types').UpdateTarget, import('./types').Updater>} */
const updateTargetToUpdater = new WeakMap();

const changeDetector = {
  /**
   * @param {import('./types').UpdateTarget} updateTarget
   * @param {import('./types').Updater} updater
   */
  register(updateTarget, updater) {
    updateTargetToUpdater.set(updateTarget, updater);
  },

  /**
   * @param {import('./types').UpdateTarget} updateTarget
   */
  unregister(updateTarget) {
    updateTargetToUpdater.delete(updateTarget);
  },

  /**
   * @param {import('./types').UpdateTarget} updateTarget
   */
  scheduleUpdate(updateTarget) {
    new Maybe(updateTargetToUpdater.get(updateTarget)).do((updater) => {
      renderQueue.addRenderTask(updater);
    });
  },
};

export default changeDetector;
