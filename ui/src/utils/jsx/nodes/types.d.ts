import {
  PrimitiveNode,
  Fragment,
  IntrinsicElement,
  CustomElement,
  EmptyNode,
} from './v-nodes';

export type Renderable = EmptyRenderable | NonEmptyRenderable;
export type NonEmptyRenderable = NonEmptyBasicRenderable | BasicRenderable[];
export type BasicRenderable = EmptyRenderable | NonEmptyBasicRenderable;
export type EmptyRenderable = null | undefined;
export type NonEmptyBasicRenderable = PrimitiveRenderable | VNode;
export type PrimitiveRenderable = string | number | boolean;
export type VNode =
  | PrimitiveNode
  | Fragment
  | IntrinsicElement
  | CustomElement
  | EmptyNode;

export type JsxType = IntrinsicElementType | CustomElementType | Symbol;
export type JsxProps = Record<string, any> | null | undefined;

export type IntrinsicElementType = string;
export type IntrinsicElementProps = Record<string, any>;

export type CustomElementType = (props: PropsWithChildren) => Renderable;
export type CustomElementContentFactory = (props: PropsWithChildren) => VNode;
export type CustomElementProps = Record<string, any>;

export type PropsWithChildren = Record<string, any> & {
  children: Fragment;
};

export type VNodeDestructor = () => void;
