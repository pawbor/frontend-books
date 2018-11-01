// this is a bit hacky but it makes all JSX pass type checking
declare namespace JSX {
  interface ElementClass {}
  interface ElementAttributesProperty {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
