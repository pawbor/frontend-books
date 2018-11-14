import render from './dom/render';
import createVNode from './nodes/create-v-node';
import { JsxFragmentSymbol } from './nodes/symbols';

const jsx = {
  createVNode,
  JsxFragmentSymbol,
  render,
};

export default jsx;
