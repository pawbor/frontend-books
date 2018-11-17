import Store from './store';

describe('state changes stream', () => {
  /** @type {import('utils/observable/types').ObserverLike<number>} */
  let observer;

  beforeEach(() => {
    observer = jest.fn();
  });

  test('initial state', () => {
    const initialState = 10;
    const store = new Store({ initialState });
    store.stateStream().subscribe(observer);
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenCalledWith(initialState);
  });

  test('buffered state', () => {
    const bufferedState = 10;
    const store = new Store({ initialState: 5 });
    store.setState(bufferedState);
    store.stateStream().subscribe(observer);
    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer).toHaveBeenCalledWith(bufferedState);
  });

  test('emited state', () => {
    const emittedState = 10;
    const store = new Store({ initialState: 5 });
    store.stateStream().subscribe(observer);
    store.setState(emittedState);
    expect(observer).toHaveBeenCalledTimes(2);
    expect(observer).toHaveBeenCalledWith(emittedState);
  });
});

describe('get current state', () => {
  test('initial state', () => {
    const initialState = 10;
    const store = new Store({ initialState });
    expect(store.getState()).toBe(initialState);
  });

  test('updated state', () => {
    const updatedState = 10;
    const store = new Store({ initialState: 5 });
    store.setState(updatedState);
    expect(store.getState()).toBe(updatedState);
  });
});
