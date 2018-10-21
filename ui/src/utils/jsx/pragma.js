import { flatten } from 'utils/array';
import { pipe } from 'utils/fp';

export default function pragma(type, props, ...children) {
  const normalizeChildren = pipe(
    flatten,
    wrapTexts
  );
  children = normalizeChildren(children);

  if (isDomElement(type)) {
    return createDomElement(type, props, children);
  }

  if (isCustomElement(type)) {
    return type(props, children);
  }

  throw new Error(`Unsupported element type: ${typeof type}`);
}

function createDomElement(type, props, children) {
  const el = document.createElement(type);

  if (isDevelopment) {
    validateProps(props, el);
  }

  setProps(props, el);
  appendChildren(children, el);
  return el;
}

function validateProps(props, element) {
  const invalidProps = Object.keys(props).filter(
    (propName) => !(propName in element)
  );

  if (invalidProps.length) {
    throw new Error(`Invalid element properties: ${invalidProps}`);
  }
}

function setProps(props, element) {
  Object.assign(element, props);
}

function appendChildren(children, element) {
  children.forEach((ch) => {
    element.appendChild(ch);
  });
}

function wrapTexts(children) {
  return children.map((ch) => {
    if (isText(ch)) {
      ch = document.createTextNode(ch);
    }
    return ch;
  });
}

function isText(nodeOrText) {
  return typeof nodeOrText === 'string';
}

function isDomElement(type) {
  return typeof type === 'string';
}

function isCustomElement(type) {
  return typeof type === 'function';
}
