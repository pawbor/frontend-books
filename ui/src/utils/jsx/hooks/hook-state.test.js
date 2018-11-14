import { noop } from 'utils/fp';

import jsx from '..';
import hookState from './hook-state';

test('initial state', () => {
  const root = document.createElement('div');
  jsx.render(<Stateful />, root);
  expect(root.innerHTML).toEqual('foo');

  function Stateful() {
    const [value] = hookState('foo');
    return value;
  }
});

test('update state', () => {
  const root = document.createElement('div');
  /** @type {(v: string) => void} */
  let update = noop;
  jsx.render(<Stateful />, root);
  const nodeBefore = root.firstChild;

  update('bar');
  expect(root.innerHTML).toEqual('bar');

  update('baz');
  expect(root.innerHTML).toEqual('baz');
  const nodeAfter = root.firstChild;

  expect(nodeAfter).toBeTruthy();
  expect(nodeBefore).toBe(nodeAfter);

  function Stateful() {
    const [value, setValue] = hookState('foo');
    update = setValue;
    return value;
  }
});

test('update state in multiple elements', () => {
  const root = document.createElement('div');
  /** @type {Array<(v: number) => void>} */
  let setters = [];

  jsx.render([<Stateful />, ' - ', <Stateful />], root);
  expect(root.innerHTML).toEqual('1 - 1');

  update(5);
  expect(root.innerHTML).toEqual('5 - 5');

  update(13);
  expect(root.innerHTML).toEqual('13 - 13');

  function Stateful() {
    const [value, setValue] = hookState(1);
    setters.push(setValue);
    return value;
  }

  /**
   * @param {number} value
   */
  function update(value) {
    const settersCopy = setters.slice();
    setters = [];
    settersCopy.forEach((setter) => {
      setter(value);
    });
  }
});

describe('update state in nested elements', () => {
  test('inner element preserves state', () => {
    const root = document.createElement('div');
    /** @type {(v: string) => void} */
    let outerUpdate = noop;
    /** @type {(v: number) => void} */
    let innerUpdate = noop;

    jsx.render(<Outer />, root);
    expect(root.innerHTML).toEqual('foo1');
    const nodeBefore = root.firstChild;

    innerUpdate(2);
    expect(root.innerHTML).toEqual('foo2');

    outerUpdate('baz');
    expect(root.innerHTML).toEqual('baz2');

    innerUpdate(3);
    expect(root.innerHTML).toEqual('baz3');

    const nodeAfter = root.firstChild;
    expect(nodeAfter).toBeTruthy();
    expect(nodeBefore).toBe(nodeAfter);

    function Outer() {
      const [value, setValue] = hookState('foo');
      outerUpdate = setValue;
      return [value, <Inner />];
    }

    function Inner() {
      const [value, setValue] = hookState(1);
      innerUpdate = setValue;
      return value;
    }
  });

  test('inner element ignores stale updates', () => {
    const root = document.createElement('div');
    /** @type {(v: string) => void} */
    let outerUpdate = noop;
    /** @type {(v: number) => void} */
    let staleInnerUpdate = noop;

    jsx.render(<Outer />, root);
    expect(root.innerHTML).toEqual('foo1');

    outerUpdate('baz');
    expect(root.innerHTML).toEqual('baz1');

    staleInnerUpdate(2);
    expect(root.innerHTML).toEqual('baz1');

    function Outer() {
      const [value, setValue] = hookState('foo');
      outerUpdate = setValue;
      return [value, <Inner />];
    }

    function Inner() {
      const [value, setValue] = hookState(1);
      if (staleInnerUpdate === noop) {
        staleInnerUpdate = setValue;
      }
      return value;
    }
  });
});
