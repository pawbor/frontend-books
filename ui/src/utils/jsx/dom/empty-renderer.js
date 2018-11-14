import { EmptyNode } from '../nodes';

/**
 * @return {import('./types').NodeRenderer<EmptyNode>}
 */
export default function EmptyRenderer() {
  return {
    /** @returns {vNode is EmptyNode}  */
    isMatchingVNode(vNode) {
      return vNode instanceof EmptyNode;
    },

    updateContainer() {},
  };
}
