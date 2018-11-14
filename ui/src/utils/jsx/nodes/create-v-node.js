import { IntrinsicElement, CustomElement, Fragment } from './v-nodes';
import { JsxFragmentSymbol } from './symbols';
import renderableToVNode from './renderable-to-v-node';

/**
 * @param {import('./types').JsxType} type
 * @param {import('./types').JsxProps} [props]
 * @param  {import('./types').BasicRenderable[]} children
 * @returns {import('./types').VNode}
 */
export default function createVNode(type, props, ...children) {
  const safeProps = Object.assign({}, props);

  const fragmentWithChildren = new Fragment(children.map(renderableToVNode));

  if (isIntrinsicElement(type)) {
    return new IntrinsicElement(type, safeProps, fragmentWithChildren);
  }

  if (isCustomElement(type)) {
    return new CustomElement(
      type,
      safeProps,
      fragmentWithChildren
    );
  }

  if (isFragment(type)) {
    return fragmentWithChildren;
  }

  throw new Error(`Unsupported element type: ${typeof type}`);
}

/**
 * @param {import('./types').JsxType} type
 * @returns {type is string}
 */
function isIntrinsicElement(type) {
  return typeof type === 'string';
}

/**
 * @param {import('./types').JsxType} type
 * @returns {type is import('./types').CustomElementType}
 */
function isCustomElement(type) {
  return typeof type === 'function';
}

/**
 * @param {import('./types').JsxType} type
 * @returns {boolean}
 */
function isFragment(type) {
  return type === JsxFragmentSymbol;
}
