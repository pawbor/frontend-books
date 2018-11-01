import { removeElement } from 'utils/array';

import EventTargetStream from './event-target-stream';

describe('subscribe', () => {
  test('add a listener to EventTarget', () => {
    const et = fakeEventTarget();
    const eventType = 'foo';
    const options = {};
    const stream = EventTargetStream(et, eventType, options);
    stream.subscribe();
    expect(et.addEventListener).toHaveBeenCalledTimes(1);
    expect(et.addEventListener).toHaveBeenCalledWith(
      eventType,
      expect.any(Function),
      options
    );
  });
});

describe('unsubscribe', () => {
  test('removes listener from EventTarget', () => {
    const et = fakeEventTarget();
    const eventType = 'foo';
    const options = {};
    const stream = EventTargetStream(et, eventType, options);
    stream.subscribe().unsubscribe();
    const listener = et.addEventListener.mock.calls[0][1];
    expect(et.removeEventListener).toHaveBeenCalledTimes(1);
    expect(et.removeEventListener).toHaveBeenCalledWith(
      eventType,
      listener,
      options
    );
  });
});

test('emits matching events', () => {
  const et = fakeEventTarget();
  const eventType = 'foo';
  const stream = EventTargetStream(et, eventType);
  const next = jest.fn();
  stream.subscribe({ next });

  const matchingEvents = Array.from({ length: 5 }, () => new Event(eventType));
  const notMatchingEvents = Array.from(
    { length: 3 },
    () => new Event('not' + eventType)
  );
  const events = [...matchingEvents, ...notMatchingEvents];
  events.forEach((event) => {
    et.dispatchEvent(event);
  });
  expect(next).toHaveBeenCalledTimes(matchingEvents.length);
  matchingEvents.forEach((event, index) => {
    expect(next).toHaveBeenNthCalledWith(index + 1, event);
  });
});

function fakeEventTarget() {
  /** @type {{type: string, listener: Function}[]} */
  const listenerRecords = [];

  return {
    addEventListener: jest.fn((type, listener) => {
      listenerRecords.push({ type, listener });
    }),

    removeEventListener: jest.fn((type, listener) => {
      listenerRecords
        .filter(
          ({ type: otherType, listener: otherListener }) =>
            type === otherType && listener === otherListener
        )
        .forEach((match) => removeElement(listenerRecords, match));
    }),

    dispatchEvent: jest.fn((event) => {
      listenerRecords
        .filter(({ type }) => type === event.type)
        .forEach(({ listener }) => listener(event));
    }),
  };
}
