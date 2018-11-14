import jsx from '..';
import hookPostRenderEffect from './hook-post-render-effect';

test('simple invocation', () => {
  const { effect } = fakeEffect();
  const root = document.createElement('div');

  jsx.render(<WithEffect />, root);
  expect(effect).toHaveBeenCalledTimes(1);

  function WithEffect() {
    hookPostRenderEffect(effect);
  }
});

test('invocation after rendered again', () => {
  const { effect, cleanup } = fakeEffect();
  const root = document.createElement('div');

  jsx.render(<WithEffect />, root);
  expect(cleanup).not.toHaveBeenCalled();

  jsx.render(<WithEffect />, root);
  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(effect).toHaveBeenCalledTimes(2);

  function WithEffect() {
    hookPostRenderEffect(effect);
  }
});

test('invocation only after change', () => {
  const { effect, cleanup } = fakeEffect();
  const root = document.createElement('div');
  jsx.render(<WithEffect value={1} />, root);

  jsx.render(<WithEffect value={1} />, root);
  expect(cleanup).not.toHaveBeenCalled();
  expect(effect).toHaveBeenCalledTimes(1);

  jsx.render(<WithEffect value={2} />, root);
  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(effect).toHaveBeenCalledTimes(2);

  /** @param {{value: any}} param0 */
  function WithEffect({ value }) {
    hookPostRenderEffect(effect, [value]);
  }
});

test('cleanup when different element', () => {
  const { effect, cleanup } = fakeEffect();
  const root = document.createElement('div');

  jsx.render(<WithEffect />, root);
  jsx.render(<Other />, root);

  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(effect).toHaveBeenCalledTimes(1);

  function WithEffect() {
    hookPostRenderEffect(effect);
  }

  function Other() {
    return 'foo';
  }
});

describe('nested elements', () => {
  test('render triggered by effect is postponed until all effects were invoked', () => {
    let counter = 0;
    let limit = 4;
    const { effect, cleanup } = fakeEffect();
    const root = document.createElement('div');

    jsx.render(<Outer />, root);

    function Inner() {
      hookPostRenderEffect(effect);
    }

    function Outer() {
      const content = [<Inner />, <Inner />];
      const expectedInvocations = counter * content.length;
      expect(effect).toHaveBeenCalledTimes(expectedInvocations);

      hookPostRenderEffect(() => {
        expect(cleanup).toHaveBeenCalledTimes(expectedInvocations);
        if (counter < limit) {
          counter++;
          jsx.render(<Outer />, root);
        }
      });
      return content;
    }

    expect(counter).toBe(limit);
  });
});

function fakeEffect() {
  const cleanup = jest.fn();
  const effect = jest.fn().mockReturnValue(cleanup);
  return { effect, cleanup };
}
