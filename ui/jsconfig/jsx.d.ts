declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {};  // specify children name to use
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
