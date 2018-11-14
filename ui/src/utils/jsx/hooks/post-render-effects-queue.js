/**
 * @type {import("./effect-hook").default[]}
 */
const pendingHooks = [];

const postRenderEffectsQueue = {
  /**
   * @param {import("./effect-hook").default} hook
   */
  addEffectHook(hook) {
    pendingHooks.push(hook);
  },

  invokePendingEffects() {
    const hook = pendingHooks.shift();

    if (!hook) {
      return;
    }

    hook.invokeEffect();
    this.invokePendingEffects();
  },
};

export default postRenderEffectsQueue;
