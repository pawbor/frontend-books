import { Maybe } from 'utils/fp';

/**
 * @typedef {Pick<HooksManager, 'openContext' | 'closeContext' | 'addHook' | 'getActiveHooksTarget' | 'getCurrentHookCell'>} HooksManagerState
 */

/** @type {WeakMap<import('./types').HooksTarget, import('./types').Hook[]>} */
const hooksTargetToHooks = new WeakMap();

class HooksManager {
  /**
   * @param {import('./types').HooksTarget} hooksTarget
   */
  openContext(hooksTarget) {
    getManagerState().openContext(hooksTarget);
  }

  closeContext() {
    getManagerState().closeContext();
  }

  /**
   * @param {import('./types').Hook} hook
   */
  addHook(hook) {
    getManagerState().addHook(hook);
  }

  /** @returns {import('./types').HooksTarget} */
  getActiveHooksTarget() {
    return getManagerState().getActiveHooksTarget();
  }

  /** @returns {import('./types').HookCell} */
  getCurrentHookCell() {
    return getManagerState().getCurrentHookCell();
  }

  /**
   * @param {import('./types').HooksTarget} prev
   * @param {import('./types').HooksTarget} next
   */
  transferHooks(prev, next) {
    new Maybe(hooksTargetToHooks.get(prev)).do((hooks) => {
      hooksTargetToHooks.set(next, hooks);
    });
  }

  /**
   * @param {import('./types').HooksTarget} hooksTarget
   */
  cleanupHooks(hooksTarget) {
    new Maybe(hooksTargetToHooks.get(hooksTarget)).do((hooks) => {
      hooks.forEach((hook) => hook.cleanup());
    });
  }
}

/** @type {HooksManagerState} */
const closedManager = {
  openContext(hooksTarget) {
    const previousHooks = hooksTargetToHooks.get(hooksTarget) || [];
    const context = {
      hooksTarget,
      currentHooks: [],
      previousHooks,
    };
    managerState = OpenedManager(context);
  },

  closeContext() {
    throw new Error('No context was opened');
  },

  addHook() {
    throw new Error('No context was opened');
  },

  getCurrentHookCell() {
    throw new Error('No context was opened');
  },

  getActiveHooksTarget() {
    throw new Error('No context was opened');
  },
};

function ClosedManager() {
  return closedManager;
}

/**
 * @param {import('./types').HooksContext} context
 * @returns {HooksManagerState}
 */
function OpenedManager(context) {
  return {
    openContext() {
      throw new Error('Hooks context already created');
    },

    closeContext() {
      setManagerState(ClosedManager());
      const { hooksTarget, currentHooks } = context;
      hooksTargetToHooks.set(hooksTarget, currentHooks) || [];
    },

    /**
     * @param {import('./types').Hook} hook
     */
    addHook(hook) {
      context.currentHooks.push(hook);
    },

    getCurrentHookCell() {
      const cellIndex = context.currentHooks.length;
      return {
        previousHook: context.previousHooks[cellIndex],
      };
    },

    /** @returns {import('./types').HooksTarget} */
    getActiveHooksTarget() {
      return context.hooksTarget;
    },
  };
}

/** @type {HooksManagerState} */
let managerState = ClosedManager();

/**
 * @param {HooksManagerState} nextState
 */
function setManagerState(nextState) {
  managerState = nextState;
}

function getManagerState() {
  return managerState;
}

const hooksManager = new HooksManager();

export default hooksManager;
