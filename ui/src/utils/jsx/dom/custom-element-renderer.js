import { Maybe } from 'utils/fp';

import { CustomElement, vNodesManager, renderableToVNode } from '../nodes';
import hooksManager from '../hooks/hooks-manager';
import changeDetector from '../hooks/change-detector';
import updateContainer from './update-container';

/**
 * @typedef {Object} Privates
 * @prop {import('../nodes/types').VNode | undefined} contentVNode
 */

/** @type {WeakMap<CustomElement, Privates>} */
const vNodeToPrivates = new WeakMap();

/**
 * @param {CustomElement} nextVNode
 * @return {import('./types').NodeRenderer<CustomElement>}
 */
export default function CustomElementRenderer(nextVNode) {
  return {
    /** @returns {vNode is CustomElement}  */
    isMatchingVNode(vNode) {
      return vNode instanceof CustomElement && vNode.type === nextVNode.type;
    },
    updateContainer(container, prevVNode) {
      new Maybe(prevVNode)
        .do((vNode) => {
          hooksManager.transferHooks(vNode, nextVNode);
        })
        .do((vNode) => {
          changeDetector.unregister(vNode);
        })
        .map((VNode) => vNodeToPrivates.get(VNode))
        .default(() => ({ contentVNode: undefined }))
        .do((prevPrivates) => renderView(container, nextVNode, prevPrivates));
    },
  };
}

/**
 * @param {import('./types').ContainerProxy} container
 * @param {CustomElement} nextVNode
 * @param {Privates} prevPrivates
 */
function renderView(container, nextVNode, prevPrivates) {
  changeDetector.register(nextVNode, () => {
    updateContainer(nextVNode, container, nextVNode);
  });
  const contentVNode = createContentVNode(nextVNode);

  /** @type {import('./types').ContainerProxy} */
  const contentContainer = {
    updateWith(nodes) {
      container.updateWith(nodes);
    },
  };

  updateContainer(contentVNode, contentContainer, prevPrivates.contentVNode);

  vNodeToPrivates.set(nextVNode, {
    contentVNode,
  });

  const destructor = () => {
    vNodesManager.destroy(contentVNode);
    changeDetector.unregister(nextVNode);
    hooksManager.cleanupHooks(nextVNode);
  };

  vNodesManager.register(nextVNode, destructor);
}

/**
 * @param {CustomElement} nextVNode
 */
function createContentVNode(nextVNode) {
  const { type, props, children } = nextVNode;

  const propsWithChildren = Object.assign({}, props, { children });
  hooksManager.openContext(nextVNode);
  const contentRenderable = type(propsWithChildren);
  hooksManager.closeContext();
  return renderableToVNode(contentRenderable);
}
