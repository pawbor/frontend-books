import renderableToVNode from './renderable-to-v-node';
import { PrimitiveNode, EmptyNode, Fragment } from './v-nodes';

test('primitive', () => {
  /** @type {any} */
  const result = renderableToVNode('foo');
  expect(result).toBeInstanceOf(PrimitiveNode);
  expect(result.value).toBe('foo');
});

test.each([[null], [undefined]])('empty [%s]', (empty) => {
  /** @type {any} */
  const result = renderableToVNode(empty);
  expect(result).toBeInstanceOf(EmptyNode);
});

test('nested array', () => {
  /** @type {any} */
  const result = renderableToVNode(['foo', ['bar'], 'baz', [['deep']]]);
  expect(result).toBeInstanceOf(Fragment);
  expect(result.children).toHaveLength(4);
  expect(result.children[3]).toBeInstanceOf(Fragment);
  expect(result.children[3].children[0]).toBeInstanceOf(Fragment);
  expect(result.children[3].children[0].children[0]).toBeInstanceOf(
    PrimitiveNode
  );
});
