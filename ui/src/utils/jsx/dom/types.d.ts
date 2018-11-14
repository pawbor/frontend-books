import { VRootSymbol } from './symbols';
import { VNode } from '../nodes/types';

export type Root = Node & { [VRootSymbol]?: VNode };

export type ContainerProxy = {
  updateWith: (nodes: Node[]) => void;
};

export interface NodeRenderer<T extends VNode> {
  isMatchingVNode(vNode: VNode | undefined): vNode is T;
  updateContainer(container: ContainerProxy, previousVNode?: T);
}
