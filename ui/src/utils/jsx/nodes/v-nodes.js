export class EmptyNode {}

export class PrimitiveNode {
  /**
   * @param {import('./types').PrimitiveRenderable} value
   */
  constructor(value) {
    this.value = value;
  }
}

export class Fragment {
  /**
   * @param {import('./types').VNode[]} children
   */
  constructor(children) {
    this.children = children;
  }
}

export class IntrinsicElement {
  /**
   * @param {import('./types').IntrinsicElementType} type
   * @param {import('./types').IntrinsicElementProps} props
   * @param {Fragment} children
   */
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

export class CustomElement {
  /**
   * @param {import('./types').CustomElementType} type
   * @param {import('./types').CustomElementProps} props
   * @param {Fragment} children
   */
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}
