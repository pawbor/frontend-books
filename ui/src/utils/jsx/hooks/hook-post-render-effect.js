import { Maybe, noop } from 'utils/fp';
import { sameContent } from 'utils/array';

import hooksManager from './hooks-manager';
import EffectHook from './effect-hook';
import postRenderEffectsQueue from './post-render-effects-queue';

/**
 * @param {import('./types').Effect} effect
 * @param {any[]} [changeIndicators]
 */
export default function hookPostRenderEffect(effect, changeIndicators) {
  const { previousHook } = hooksManager.getCurrentHookCell();

  new Maybe(previousHook)
    .default(() => defaultHook())
    .map((hook) => (hook instanceof EffectHook ? hook : null))
    .do((hook) => {
      queueEffectOnChange(hook, effect, changeIndicators);
    })
    .default(() => {
      throw new Error('Hook mismatch');
    });
}

function defaultHook() {
  const hook = new EffectHook(noop, undefined);
  hook.invokeEffect();
  return hook;
}

/**
 *
 * @param {EffectHook} previousHook
 * @param {import('./types').Effect} effect
 * @param {any[] | undefined} changeIndicators
 */
function queueEffectOnChange(previousHook, effect, changeIndicators) {
  const noChange =
    !!previousHook.changeIndicators &&
    !!changeIndicators &&
    sameContent(previousHook.changeIndicators, changeIndicators);

  if (noChange) {
    hooksManager.addHook(previousHook);
    return;
  }

  previousHook.cleanup();
  const hook = new EffectHook(effect, changeIndicators);
  postRenderEffectsQueue.addEffectHook(hook);
  hooksManager.addHook(hook);
}
