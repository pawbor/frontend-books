import jsx from '..';
import render from './render';
import { Maybe } from 'utils/fp';

beforeEach(() => {
  __DEBUG__ = true;
});

describe('primitives', () => {
  test('string', () => {
    const root = document.createElement('div');
    const text = 'foo';
    render(text, root);
    expect(root.innerHTML).toEqual(text);
  });

  test('number', () => {
    const root = document.createElement('div');
    const number = 10;
    render(number, root);
    expect(root.innerHTML).toEqual(`${number}`);
  });

  test('boolean', () => {
    const root = document.createElement('div');
    const boolean = true;
    render(boolean, root);
    expect(root.innerHTML).toEqual(`${boolean}`);
  });

  test('undefined', () => {
    const root = document.createElement('div');
    render(undefined, root);
    expect(root.innerHTML).toEqual('');
  });

  test('null', () => {
    const root = document.createElement('div');
    render(null, root);
    expect(root.innerHTML).toEqual('');
  });

  test('update primitive', () => {
    const root = document.createElement('div');

    render('foo', root);
    const childBefore = root.firstChild;

    render('bar', root);
    const childAfter = root.firstChild;

    expect(root.innerHTML).toBe('bar');
    expect(childBefore).toBe(childAfter);
  });
});

describe('intrinsic element', () => {
  test('simple', () => {
    const root = document.createElement('div');
    render(<div />, root);
    expect(root.innerHTML).toEqual('<div></div>');
  });

  test('with className prop', () => {
    const root = document.createElement('div');
    render(<div className="foo bar" />, root);
    expect(root.innerHTML).toEqual('<div class="foo bar"></div>');
  });

  test('with event', () => {
    const root = document.createElement('div');
    const clickListener = jest.fn();
    render(<div onclick={clickListener} />, root);
    new Maybe(root.children)
      .map((children) => children.item(0))
      .map((child) => (child instanceof HTMLElement ? child : null))
      .do((target) => target.click());

    expect(clickListener).toHaveBeenCalledTimes(1);
    expect(clickListener).toHaveBeenCalledWith(expect.any(Event));
  });

  test('with invalid prop in debug mode', () => {
    __DEBUG__ = true;
    const root = document.createElement('div');
    function harnessFn() {
      render(<div invalidProp="foo bar" />, root);
    }
    expect(harnessFn).toThrowError(/invalidProp/);
  });

  test('with invalid prop in production mode', () => {
    __DEBUG__ = false;
    const root = document.createElement('div');
    render(<div invalidProp="foo bar" />, root);
    expect(root.innerHTML).toBe('<div invalidprop="foo bar"></div>');
  });

  test('nested elements', () => {
    const root = document.createElement('div');
    render(
      <div>
        foo <span>bar</span>
      </div>,
      root
    );
    expect(root.innerHTML).toEqual('<div>foo <span>bar</span></div>');
  });

  test('update content', () => {
    const root = document.createElement('div');

    render(
      <div>
        foo <span className="first" />
      </div>,
      root
    );
    const nodesBefore = new Maybe(root.firstChild)
      .map((node) => [node, ...Array.from(node.childNodes)])
      .getValue([]);

    render(
      <div>
        bar <span className="second" />
      </div>,
      root
    );
    const nodesAfter = new Maybe(root.firstChild)
      .map((node) => [node, ...Array.from(node.childNodes)])
      .getValue([]);

    expect(root.innerHTML).toBe('<div>bar <span class="second"></span></div>');
    expect(nodesBefore).toHaveLength(3);
    expect(nodesAfter).toHaveLength(nodesBefore.length);
    nodesBefore.forEach((nodeBefore, index) => {
      const nodeAfter = nodesAfter[index];
      expect(nodeBefore).toBe(nodeAfter);
    });
  });

  test('update properties', () => {
    const root = document.createElement('div');

    render(<div className="foo">foo</div>, root);
    const childBefore = root.firstChild;

    render(<div style="background: red;">foo</div>, root);
    const childAfter = root.firstChild;

    expect(root.innerHTML).toBe('<div style="background: red;">foo</div>');
    expect(childBefore).toBe(childAfter);
  });
});

describe('custom element', () => {
  test('empty', () => {
    const root = document.createElement('div');
    render(<Empty />, root);
    expect(root.innerHTML).toEqual('');

    function Empty() {}
  });

  test('with properties', () => {
    const root = document.createElement('div');
    render(<Sum a={3} b={5} />, root);
    expect(root.innerHTML).toEqual('8');

    /**
     * @param {{a: number, b: number}} param0
     */
    function Sum({ a, b }) {
      return a + b;
    }
  });

  test('with children', () => {
    const root = document.createElement('div');
    render(
      <Outer>
        foo <span>bar</span> baz <Inner />
      </Outer>,
      root
    );
    expect(root.innerHTML).toEqual('<div>foo <span>bar</span> baz inner</div>');

    /**
     * @param {{children: import('../nodes/types').Renderable[]}} param0
     */
    function Outer({ children }) {
      return <div>{children}</div>;
    }

    function Inner() {
      return 'inner';
    }
  });

  test('update properties', () => {
    const root = document.createElement('div');

    render(<Custom msg="foo" />, root);
    const nodesBefore = Array.from(root.childNodes);

    render(<Custom msg="bar" />, root);
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<div>bar</div>bar');
    expect(nodesBefore).toHaveLength(nodesAfter.length);
    nodesBefore.forEach((nodeBefore, index) => {
      const nodeAfter = nodesAfter[index];
      expect(nodeBefore).toBe(nodeAfter);
    });

    /**
     *
     * @param {{msg: string}} param0
     */
    function Custom({ msg }) {
      return [<div>{msg}</div>, msg];
    }
  });

  test('update children', () => {
    const root = document.createElement('div');

    render(
      <Custom>
        <div>first</div>
        <div>second</div>
      </Custom>,
      root
    );
    const nodesBefore = Array.from(root.childNodes);

    render(
      <Custom>
        <div>third</div>
        <div>fourth</div>
      </Custom>,
      root
    );
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<div>third</div><div>fourth</div>');
    expect(nodesBefore).toHaveLength(nodesAfter.length);
    nodesBefore.forEach((nodeBefore, index) => {
      const nodeAfter = nodesAfter[index];
      expect(nodeBefore).toBe(nodeAfter);
    });

    /**
     * @param {{children: import('../nodes/types').VNode[]}} param0
     */
    function Custom({ children }) {
      return children;
    }
  });
});

test('fragment', () => {
  const root = document.createElement('div');

  render(
    <>
      <span className="first" />
      {'foo'}
      <span className="second" />
      <Custom>custom</Custom>
    </>,
    root
  );

  expect(root.innerHTML).toBe(
    '<span class="first"></span>foo<span class="second"></span>custom'
  );

  /**
   * @param {{children: any}} param0
   */
  function Custom({ children }) {
    return children;
  }
});

describe('array of nodes', () => {
  test('update elements', () => {
    const root = document.createElement('div');

    render(
      [
        <span className="first" />,
        'foo',
        <span className="second" />,
        <Custom>custom</Custom>,
      ],
      root
    );
    const nodesBefore = Array.from(root.childNodes);

    render(
      [
        <span className="first">updated</span>,
        'bar',
        <span className="second-updated" />,
        <Custom>custom updated</Custom>,
      ],
      root
    );
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe(
      '<span class="first">updated</span>bar<span class="second-updated"></span>custom updated'
    );
    expect(nodesBefore).toHaveLength(nodesAfter.length);
    nodesBefore.forEach((nodeBefore, index) => {
      const nodeAfter = nodesAfter[index];
      expect(nodeBefore).toBe(nodeAfter);
    });

    /**
     * @param {{children: any}} param0
     */
    function Custom({ children }) {
      return children;
    }
  });

  test('remove element', () => {
    const root = document.createElement('div');

    render([<span className="first" />, <div className="second" />], root);
    const nodesBefore = Array.from(root.childNodes);

    render([<div className="second" />], root);
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<div class="second"></div>');
    expect(nodesBefore[1]).toEqual(nodesAfter[0]);
    expect(nodesBefore[1]).not.toBe(nodesAfter[0]);
  });
});

describe('mixed', () => {
  test('replace node with array of nodes', () => {
    const root = document.createElement('div');

    render(<span className="first" />, root);
    const nodesBefore = Array.from(root.childNodes);

    render([<span className="first" />], root);
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<span class="first"></span>');
    expect(nodesBefore[0]).toEqual(nodesAfter[0]);
    expect(nodesBefore[0]).not.toBe(nodesAfter[0]);
  });

  test('replace array of nodes with node', () => {
    const root = document.createElement('div');

    render([<span className="first" />], root);
    const nodesBefore = Array.from(root.childNodes);

    render(<span className="first" />, root);
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<span class="first"></span>');
    expect(nodesBefore[0]).toEqual(nodesAfter[0]);
    expect(nodesBefore[0]).not.toBe(nodesAfter[0]);
  });

  test('replace node with custom element', () => {
    const root = document.createElement('div');

    render(<span className="first" />, root);
    const nodesBefore = Array.from(root.childNodes);

    render(<Custom />, root);
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<span class="first"></span>');
    expect(nodesBefore[0]).toEqual(nodesAfter[0]);
    expect(nodesBefore[0]).not.toBe(nodesAfter[0]);

    function Custom() {
      return <span className="first" />;
    }
  });

  test('replace custom element with node', () => {
    const root = document.createElement('div');

    render(<Custom />, root);
    const nodesBefore = Array.from(root.childNodes);

    render(<span className="first" />, root);
    const nodesAfter = Array.from(root.childNodes);

    expect(root.innerHTML).toBe('<span class="first"></span>');
    expect(nodesBefore[0]).toEqual(nodesAfter[0]);
    expect(nodesBefore[0]).not.toBe(nodesAfter[0]);

    function Custom() {
      return <span className="first" />;
    }
  });
});
