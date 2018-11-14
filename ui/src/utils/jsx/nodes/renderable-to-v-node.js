import { Maybe } from 'utils/fp';

import { PrimitiveNode, Fragment, EmptyNode } from './v-nodes';

/**
 *
 * @param {import('./types').Renderable} renderable
 * @returns {import('./types').VNode}
 */
export default function renderableToVNode(renderable) {
  return new Maybe(renderable)
    .map(wrapArrayOfRenderables)
    .map(wrapPrimitiveRenderable)
    .getValue(new EmptyNode());
}

/**
 * @param {import('./types').NonEmptyRenderable} renderable
 * @returns {import('./types').NonEmptyBasicRenderable}
 */
function wrapArrayOfRenderables(renderable) {
  if (isArrayOfRenderables(renderable)) {
    const children = renderable.map((child) => renderableToVNode(child));
    return new Fragment(children);
  } else {
    return renderable;
  }
}

/**
 * @param {import('./types').Renderable} renderable
 * @return {renderable is import('./types').BasicRenderable[]}
 */
function isArrayOfRenderables(renderable) {
  return Array.isArray(renderable);
}

/**
 * @param {import('./types').NonEmptyBasicRenderable} renderable
 * @returns {import('./types').VNode}
 */
function wrapPrimitiveRenderable(renderable) {
  if (isPrimitiveRenderable(renderable)) {
    return new PrimitiveNode(renderable);
  } else {
    return renderable;
  }
}

/**
 * @param {import('./types').Renderable} renderable
 * @return {renderable is import('./types').PrimitiveRenderable}
 */
function isPrimitiveRenderable(renderable) {
  return ['string', 'number', 'boolean'].includes(typeof renderable);
}
