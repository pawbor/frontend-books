import { renderableToVNode } from '../nodes';
import { VRootSymbol } from './symbols';
import updateContainer from './update-container';
import batchAppend from './batch-append';
import renderQueue from '../hooks/render-queue';

/**
 * @param {import('../nodes/types').Renderable} renderable
 * @param {import('./types').Root} root
 */
export default function render(renderable, root) {
  const previousVNode = root[VRootSymbol];
  const nextVNode = renderableToVNode(renderable);

  /** @type {import('./types').ContainerProxy} */
  const container = {
    updateWith: (nodes) => {
      batchAppend(root, nodes);
    },
  };

  root[VRootSymbol] = nextVNode;
  renderQueue.addRenderTask(() => {
    updateContainer(nextVNode, container, previousVNode);
  });
}
