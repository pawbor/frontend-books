import Store from './store';

describe('state changes stream', () => {
  /** @type {import('utils/streams/types').Subscriber<number>} */
  let subscriber;

  beforeEach(() => {
    subscriber = { next: jest.fn() };
  });

  test('initial state', () => {
    const initialState = 10;
    const store = new Store({ initialState });
    store.stateStream().subscribe(subscriber);
    expect(subscriber.next).toHaveBeenCalledTimes(1);
    expect(subscriber.next).toHaveBeenCalledWith(initialState);
  });

  test('buffered state', () => {
    const bufferedState = 10;
    const store = new Store({ initialState: 5 });
    store.setState(bufferedState);
    store.stateStream().subscribe(subscriber);
    expect(subscriber.next).toHaveBeenCalledTimes(1);
    expect(subscriber.next).toHaveBeenCalledWith(bufferedState);
  });

  test('emited state', () => {
    const emittedState = 10;
    const store = new Store({ initialState: 5 });
    store.stateStream().subscribe(subscriber);
    store.setState(emittedState);
    expect(subscriber.next).toHaveBeenCalledTimes(2);
    expect(subscriber.next).toHaveBeenCalledWith(emittedState);
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
