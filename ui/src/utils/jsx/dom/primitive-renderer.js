import { Maybe } from 'utils/fp';

import { PrimitiveNode, vNodesManager } from '../nodes';

/** @type {WeakMap<PrimitiveNode, Text>} */
const vNodeToText = new WeakMap();

/**
 * @param {PrimitiveNode} nextVNode
 * @return {import('./types').NodeRenderer<PrimitiveNode>}
 */
export default function PrimitiveRenderer(nextVNode) {
  return {
    /** @returns {vNode is PrimitiveNode}  */
    isMatchingVNode(vNode) {
      return vNode instanceof PrimitiveNode;
    },
    updateContainer(container, prevVNode) {
      new Maybe(prevVNode)
        .map((vNode) => vNodeToText.get(vNode))
        .default(() => emptyText())
        .do((text) => {
          text.textContent = `${nextVNode.value}`;
        })
        .do((text) => {
          container.updateWith([text]);
        })
        .do((text) => {
          vNodeToText.set(nextVNode, text);
        })
        .do((text) => {
          registerInNodesManager(nextVNode, text);
        });
    },
  };
}

function emptyText() {
  return document.createTextNode('');
}

/**
 * @param {PrimitiveNode} nextVNode
 * @param {Text} text
 */
function registerInNodesManager(nextVNode, text) {
  const destructor = () => text.remove();
  vNodesManager.register(nextVNode, destructor);
}
