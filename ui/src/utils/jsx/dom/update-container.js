import { vNodesManager } from '../nodes';
import {
  PrimitiveNode,
  IntrinsicElement,
  CustomElement,
  Fragment,
  EmptyNode,
} from '../nodes';
import postRenderEffectsQueue from '../hooks/post-render-effects-queue';
import PrimitiveRenderer from './primitive-renderer';
import IntrinsicElementRenderer from './intrinsic-element-render';
import CustomElementRenderer from './custom-element-renderer';
import FragmentRenderer from './fragment-renderer';
import EmptyRenderer from './empty-renderer';

/**
 * @param {import('../nodes/types').VNode} nextVNode
 * @param {import('./types').ContainerProxy} container
 * @param {import('../nodes/types').VNode} [previousVNode]
 */
export default function updateContainer(nextVNode, container, previousVNode) {
  if (nextVNode instanceof PrimitiveNode) {
    const renderer = PrimitiveRenderer(nextVNode);
    useRendererToUpdateContainer(renderer, container, previousVNode);
    return;
  }

  if (nextVNode instanceof IntrinsicElement) {
    const renderer = IntrinsicElementRenderer(nextVNode);
    useRendererToUpdateContainer(renderer, container, previousVNode);
    return;
  }

  if (nextVNode instanceof CustomElement) {
    const renderer = CustomElementRenderer(nextVNode);
    useRendererToUpdateContainer(renderer, container, previousVNode);
    return;
  }

  if (nextVNode instanceof Fragment) {
    const renderer = FragmentRenderer(nextVNode);
    useRendererToUpdateContainer(renderer, container, previousVNode);
    return;
  }

  if (nextVNode instanceof EmptyNode) {
    const renderer = EmptyRenderer();
    useRendererToUpdateContainer(renderer, container, previousVNode);
    return;
  }

  throw new Error(`Unsupported VNode ${nextVNode}`);
}

let updatesCounter = 0;
let finishedUpdatesCounter = 0;

/**
 * @template {import('../nodes/types').VNode} T
 * @param {import('./types').NodeRenderer<T>} renderer
 * @param {import('./types').ContainerProxy} container
 * @param {import('../nodes/types').VNode} [previousVNode]
 */
function useRendererToUpdateContainer(renderer, container, previousVNode) {
  updatesCounter++;
  try {
    if (renderer.isMatchingVNode(previousVNode)) {
      renderer.updateContainer(container, previousVNode);
    } else {
      vNodesManager.destroy(previousVNode);
      renderer.updateContainer(container);
    }
  } finally {
    finishedUpdatesCounter++;
  }

  if (updatesCounter === finishedUpdatesCounter) {
    resetCounters();
    postRenderEffectsQueue.invokePendingEffects();
  }
}

function resetCounters() {
  updatesCounter = 0;
  finishedUpdatesCounter = 0;
}
