import { Maybe } from 'utils/fp';

import { IntrinsicElement, vNodesManager } from '../nodes';
import updateContainer from './update-container';
import batchAppend from './batch-append';

/** @type {WeakMap<IntrinsicElement, Element>} */
const vNodeToElement = new WeakMap();

/**
 * @param {IntrinsicElement} nextVNode
 * @return {import('./types').NodeRenderer<IntrinsicElement>}
 */
export default function IntrinsicElementRenderer(nextVNode) {
  return {
    /** @returns {vNode is IntrinsicElement}  */
    isMatchingVNode(vNode) {
      return vNode instanceof IntrinsicElement && vNode.type === nextVNode.type;
    },
    updateContainer(container, prevVNode) {
      const { type, props, children } = nextVNode;

      const prevProps = new Maybe(prevVNode).map(({ props }) => props);
      const prevChildren = new Maybe(prevVNode).map(({ children }) => children);

      new Maybe(prevVNode)
        .map((vNode) => vNodeToElement.get(vNode))
        .default(() => emptyElement(type))
        .do((element) => {
          updateProps(props, prevProps.getValue({}), element);
        })
        .do((element) => {
          appendChildren(children, element, prevChildren.getRawValue());
        })
        .do((element) => {
          container.updateWith([element]);
        })
        .do((element) => vNodeToElement.set(nextVNode, element))
        .do((element) => registerInNodesManager(nextVNode, element, children));
    },
  };
}

/**
 * @param {string} type
 */
function emptyElement(type) {
  return document.createElement(type);
}

/**
 * @param {import('../nodes/types').IntrinsicElementProps} props
 * @param {import('../nodes/types').IntrinsicElementProps} prevProps
 * @param {Element} element
 */
function updateProps(props, prevProps, element) {
  if (__DEBUG__) {
    validateProps(props, element);
  }

  const propsChanges = composePropsChanges(props, prevProps, element);
  propsChanges.forEach((change) => applyPropChange(change, element));
}

/**
 * @param {import('../nodes/types').IntrinsicElementProps} props
 * @param {Element} element
 */
function validateProps(props, element) {
  const invalidProps = Object.keys(props).filter(
    (propName) => !(propName in element)
  );

  if (invalidProps.length) {
    throw new Error(`Invalid element properties: ${invalidProps}`);
  }
}

/**
 * @param {import('../nodes/types').IntrinsicElementProps} props
 * @param {import('../nodes/types').IntrinsicElementProps} prevProps
 * @param {Element} element
 */
function composePropsChanges(props, prevProps, element) {
  /** @type {Record<string, any>} */
  const sourceOfDefaults = document.createElement(element.tagName);

  return Array.from(
    new Set([...Object.keys(props), ...Object.keys(prevProps)]).values(),
    (propName) => ({
      propName,
      next: props[propName],
      last: prevProps[propName],
      defaultValue: sourceOfDefaults[propName],
    })
  );
}

/**
 * @param {Object} param0
 * @param {string} param0.propName
 * @param {any} param0.next
 * @param {any} param0.last
 * @param {any} param0.defaultValue
 * @param {Element} element
 */
function applyPropChange({ propName, next, last, defaultValue }, element) {
  const isEventListener = propName.toLowerCase().startsWith('on');

  if (isEventListener) {
    Object.assign(element, { [propName.toLowerCase()]: next });
    return;
  }

  const lastWasSet = last !== null && last !== undefined;
  const nextIsNotSetOrDefault =
    next === defaultValue || next === null || next === undefined;
  const shouldRemove =
    !shouldIgnoreRemove(propName) && lastWasSet && nextIsNotSetOrDefault;

  if (shouldRemove) {
    const mapped = mapPropName(propName);
    element.removeAttribute(mapped);
    return;
  }
  const useProperty = propName in element;
  if (useProperty) {
    Object.assign(element, { [propName]: next });
  } else {
    element.setAttribute(propName, '' + next);
  }
}

const propsThatShouldIgnoreRemove = ['checked', 'value'];

/**
 * @param {string} propName
 * @returns {boolean}
 */
function shouldIgnoreRemove(propName) {
  return propsThatShouldIgnoreRemove.includes(propName);
}

/** @type {Record<string, string>} */
const propNameMapping = {
  className: 'class',
};

/**
 * @param {string} propName
 * @returns {string}
 */
function mapPropName(propName) {
  return propNameMapping[propName] || propName;
}

/**
 * @param {import('../nodes').Fragment} children
 * @param {Element} element
 * @param {import('../nodes/types').VNode} [prevChildren]
 */
function appendChildren(children, element, prevChildren) {
  /** @type {import('./types').ContainerProxy} */
  const container = {
    updateWith(nodes) {
      batchAppend(element, nodes);
    },
  };
  updateContainer(children, container, prevChildren);
}

/**
 * @param {IntrinsicElement} nextVNode
 * @param {Element} element
 * @param {import('../nodes').Fragment} children
 */
function registerInNodesManager(nextVNode, element, children) {
  const destructor = () => {
    vNodesManager.destroy(children);
    element.remove();
  };
  vNodesManager.register(nextVNode, destructor);
}
