import { Maybe } from 'utils/fp';

/** @type {WeakMap<import('../nodes/types').VNode, import('./types').VNodeDestructor>} */
const vNodeToDestructor = new WeakMap();

const vNodesManager = {
  /**
   * @param {import('../nodes/types').VNode} vNode
   * @param {import('./types').VNodeDestructor} destructor
   */
  register(vNode, destructor) {
    vNodeToDestructor.set(vNode, destructor);
  },

  /**
   * @param {import('../nodes/types').VNode | undefined} vNode
   */
  destroy(vNode) {
    new Maybe(vNode)
      .map((vNode) => vNodeToDestructor.get(vNode))
      .do((destructor) => destructor());
  },
};
export default vNodesManager;
