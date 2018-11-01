import { flatten } from 'utils/array';
import { pipe } from 'utils/fp';

/**
 * @param {import('./types').JsxElementType} type
 * @param {import('./types').JsxProps} [props]
 * @param  {...import('./types').JsxChild} children
 */
export default function pragma(type, props = null, ...children) {
  const normalizeChildren = pipe(
    flatten,
    wrapTexts
  );
  children = normalizeChildren(children);

  if (isDomElement(type)) {
    return createDomElement(type, props, children);
  }

  if (isCustomElement(type)) {
    return createCustomElement(type, props, children);
  }

  throw new Error(`Unsupported element type: ${typeof type}`);
}

/**
 *
 * @param {string} type
 * @param {Object} props
 * @param  {...import('./types').JsxChild} children
 */
function createDomElement(type, props, children) {
  const el = document.createElement(type);

  if (__DEBUG__) {
    validateProps(props, el);
  }

  setProps(props, el);
  appendChildren(children, el);
  return el;
}

/**
 * @param {import('./types').JsxProps} props
 * @param {HTMLElement} element
 */
function validateProps(props, element) {
  const invalidType = !isPropsValidType(props);
  if (invalidType) {
    throw new Error(`Invalid props type: ${typeof props}`);
  }
  const invalidProps = props
    ? Object.keys(props).filter((propName) => !(propName in element))
    : [];

  if (invalidProps.length) {
    throw new Error(`Invalid element properties: ${invalidProps}`);
  }
}

/**
 * @param {import('./types').JsxProps} props
 */
function isPropsValidType(props) {
  // typeof null === 'object'!
  return ['object', 'undefined'].includes(typeof props);
}

/**
 * @param {import('./types').JsxProps} props
 * @param {HTMLElement} element
 */
function setProps(props, element) {
  Object.assign(element, props);
}

/**
 * @param {HTMLElement[]} children
 * @param {HTMLElement} element
 */
function appendChildren(children, element) {
  children.forEach((ch) => {
    element.appendChild(ch);
  });
}

/**
 *
 * @param {import('./types').JsxChild[]} children
 */
function wrapTexts(children) {
  return children.map((ch) => {
    if (isText(ch)) {
      ch = document.createTextNode(`${ch}`);
    }
    return ch;
  });
}

/**
 * @param {import('./types').JsxChild} nodeOrText
 * @return {nodeOrText is import('./types').JsxText}
 */
function isText(nodeOrText) {
  return ['string', 'number', 'boolean'].includes(typeof nodeOrText);
}

/**
 * @param {import('./types').JsxElementType} type
 * @returns {type is string}
 */
function isDomElement(type) {
  return typeof type === 'string';
}

/**
 * @param {import('./types').JsxElementType} type
 * @returns {type is import('./types').JsxCustomType}
 */
function isCustomElement(type) {
  return typeof type === 'function';
}

/**
 * @param {import('./types').JsxCustomType} type
 * @param {import('./types').JsxProps} props
 * @param {import('./types').JsxChild[]} children
 */
function createCustomElement(type, props, children) {
  return type({ props, children });
}
