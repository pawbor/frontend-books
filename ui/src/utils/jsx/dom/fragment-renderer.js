import { Maybe } from 'utils/fp';

import { Fragment, EmptyNode, vNodesManager } from '../nodes';
import updateContainer from './update-container';

/**
 * @param {Fragment} nextVNode
 * @return {import('./types').NodeRenderer<Fragment>}
 */
export default function FragmentRenderer(nextVNode) {
  return {
    /** @returns {vNode is Fragment}  */
    isMatchingVNode(vNode) {
      return vNode instanceof Fragment;
    },
    updateContainer(container, previousVNode) {
      const { children: nextChildren } = nextVNode;

      /** @type {Node[]} */
      let allNodes = [];

      /** @type {import('./types').ContainerProxy} */
      const childContainer = {
        updateWith(nodes) {
          allNodes = [...allNodes, ...nodes];
        },
      };

      new Maybe(previousVNode)
        .map(({ children }) => children)
        .default(() => [])
        .do((prevChildren) => {
          updateExistingChildren(prevChildren, nextChildren, childContainer);
          renderNewChildren(prevChildren, nextChildren, childContainer);
        });

      container.updateWith(allNodes);

      registerInNodesManager(nextVNode);
    },
  };
}

/**
 * @param {import('../nodes/types').VNode[]} prevChildren
 * @param {import('../nodes/types').VNode[]} nextChildren
 * @param {import('./types').ContainerProxy} container
 */
function updateExistingChildren(prevChildren, nextChildren, container) {
  prevChildren.forEach((prevChild, index) => {
    const nextChild = nextChildren[index] || new EmptyNode();
    updateContainer(nextChild, container, prevChild);
  });
}

/**
 * @param {import('../nodes/types').VNode[]} prevChildren
 * @param {import('../nodes/types').VNode[]} nextChildren
 * @param {import('./types').ContainerProxy} container
 
 */
function renderNewChildren(prevChildren, nextChildren, container) {
  nextChildren.slice(prevChildren.length).forEach((nextChild) => {
    updateContainer(nextChild, container);
  });
}

/**
 * @param {Fragment} nextVNode
 */
function registerInNodesManager(nextVNode) {
  const destructor = () => {
    nextVNode.children.forEach((ch) => vNodesManager.destroy(ch));
  };
  vNodesManager.register(nextVNode, destructor);
}
