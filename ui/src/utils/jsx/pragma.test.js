import pragma from './pragma';

beforeEach(() => {
  global.__DEBUG__ = false;
});

describe('dom element', () => {
  test('simple', () => {
    const expectedElement = document.createElement('div');
    const result = pragma('div');
    expect(result).toStrictEqual(expectedElement);
  });

  test('with properties', () => {
    const expectedElement = document.createElement('div');
    const expectedProperties = { className: 'foo' };
    Object.assign(expectedElement, expectedProperties);

    const result = pragma('div', expectedProperties);
    expect(result).toStrictEqual(expectedElement);
  });

  test('with invalid properties in debug mode', () => {
    global.__DEBUG__ = true;
    function harnessFn() {
      pragma('div', { invalidProperty: 'foo' });
    }
    expect(harnessFn).toThrow(/invalidProperty/);
  });

  test('with text', () => {
    const expectedText = 'hello world';
    const expectedElement = document.createElement('div');
    expectedElement.innerHTML = expectedText;

    const result = pragma('div', null, expectedText);
    expect(result).toStrictEqual(expectedElement);
  });

  test('with child element', () => {
    const expectedChild = document.createElement('div');
    expectedChild.innerHTML = 'foo';
    const expectedElement = document.createElement('div');
    expectedElement.appendChild(expectedChild);

    const result = pragma('div', null, clone(expectedChild));
    expect(result).toStrictEqual(expectedElement);
  });

  test('with multiple children', () => {
    const expectedChildren = Array.from({ length: 3 }, (_, index) => {
      const el = document.createElement('div');
      el.innerHTML = index;
      return el;
    });
    const expectedElement = document.createElement('div');
    expectedChildren.forEach((el) => {
      expectedElement.appendChild(el);
    });

    const result = pragma('div', null, ...expectedChildren.map(clone));
    expect(result).toStrictEqual(expectedElement);
  });

  test('with multiple nested children', () => {
    const expectedChildren = Array.from({ length: 3 }, (_, index) => {
      const el = document.createElement('div');
      el.innerHTML = index;
      return el;
    });
    const expectedElement = document.createElement('div');
    expectedChildren.forEach((el) => {
      expectedElement.appendChild(el);
    });

    const result = pragma(
      'div',
      null,
      expectedChildren.slice(0, 1).map(clone),
      expectedChildren.slice(1).map(clone)
    );
    expect(result).toStrictEqual(expectedElement);
  });

  function clone(element) {
    return element.cloneNode(true);
  }
});

describe('custom element', () => {
  test('with props', () => {
    const expectedElement = 'some DOM element';
    const expectedProps = { someProp: 'foo' };
    const customElement = jest.fn().mockReturnValue(expectedElement);
    const result = pragma(customElement, expectedProps);
    expect(result).toStrictEqual(expectedElement);
    expect(customElement).toHaveBeenCalledWith({
      props: expectedProps,
      children: [],
    });
  });

  test('with children', () => {
    const expectedElement = 'some DOM element';
    const expectedChildren = Array.from({ length: 3 }, (_, index) => {
      const el = document.createElement('div');
      el.innerHTML = index;
      return el;
    });
    const customElement = jest.fn().mockReturnValue(expectedElement);
    const result = pragma(
      customElement,
      null,
      expectedChildren.slice(0, 1),
      expectedChildren.slice(1)
    );
    expect(result).toStrictEqual(expectedElement);
    expect(customElement).toHaveBeenCalledWith({
      props: null,
      children: expectedChildren,
    });
  });
});

test.each([10, true, {}])('unsupported type %j', (unsupportedType) => {
  function harnessFn() {
    pragma(unsupportedType);
  }
  expect(harnessFn).toThrowError();
});
