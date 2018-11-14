/** @type {Function[]} */
const pendingRenders = [];

let isIdle = true;

const renderQueue = {
  /**
   *
   * @param {Function} render
   */
  addRenderTask(render) {
    pendingRenders.push(render);
    if (isIdle) {
      this.invokePendingRenders();
    }
  },

  invokePendingRenders() {
    if (!isIdle) {
      throw new Error('Already started');
    }

    isIdle = false;
    try {
      while (pendingRenders.length > 0) {
        this.startNextRender();
      }
    } finally {
      isIdle = true;
    }
  },

  startNextRender() {
    const render = pendingRenders.shift();

    if (!render) {
      throw new Error('Nothing to render');
    }

    render();
  },
};

export default renderQueue;
