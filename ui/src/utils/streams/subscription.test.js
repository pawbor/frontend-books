import { withoutElement } from 'utils/array';
import { noop } from 'utils/fp';

import Subscription from './subscription';
import Notifier from './notifier';

describe('Subscription', () => {
  test('with subscriber', () => {
    const subscriber = { next: noop };
    const subscription = Subscription(subscriber);
    expect(subscription.getSubscriber()).toBe(subscriber);
  });

  test('with default subscriber', () => {
    const subscription = Subscription();
    expect(subscription.getSubscriber()).toHaveProperty('next');
  });
});

describe('connect', () => {
  test('creates parent-child relation', () => {
    const {
      parent,
      children: [child],
    } = prepareConnectedSubscriptions();
    expect(child.getParent()).toBe(parent);
    expect(parent.getChildren()).toContain(child);
  });

  test('fails if has parent', () => {
    const {
      children: [child],
    } = prepareConnectedSubscriptions();
    function harnessFn() {
      const tryParent = Subscription();
      tryParent.connect(child);
    }
    expect(harnessFn).toThrowError('Parent is already set');
  });
});

describe('disconnect', () => {
  test('destroys parent-child relation', () => {
    const { parent, children } = prepareConnectedSubscriptions();
    const childToDisconnect = children[2];
    const otherChildren = withoutElement(children, childToDisconnect);

    parent.disconnect(childToDisconnect);
    expect(childToDisconnect.getParent()).toBeUndefined();
    expect(parent.getChildren()).toEqual(otherChildren);
  });

  describe('no parent-child relation', () => {
    test('throws error', () => {
      const { parent } = prepareConnectedSubscriptions();
      const childToDisconnect = Subscription();

      function harnessFn() {
        parent.disconnect(childToDisconnect);
      }
      expect(harnessFn).toThrowError('No parent-child relation');
    });
  });
});

describe('setParent', () => {
  test('sets parent', () => {
    const parent = Subscription();
    const child = Subscription();
    child.setParent(parent);
    expect(child.getParent()).toBe(parent);
  });

  test('fails if has parent', () => {
    const parent = Subscription();
    const child = Subscription();
    child.setParent(parent);
    function harnessFn() {
      const tryParent = Subscription();
      child.setParent(tryParent);
    }
    expect(harnessFn).toThrowError('Parent is already set');
  });
});

describe('setNotifier', () => {
  test('sets notifier', () => {
    const notifier = Notifier();
    const sub = Subscription();
    sub.setNotifier(notifier);
    expect(sub.getNotifier()).toBe(notifier);
  });

  test('fails if has notofier', () => {
    const notifier = Notifier();
    const sub = Subscription();
    sub.setNotifier(notifier);
    function harnessFn() {
      const tryNotifier = Notifier();
      sub.setNotifier(tryNotifier);
    }
    expect(harnessFn).toThrowError('Notifier is already set');
  });
});

describe('unsubscribe', () => {
  test('disconnects itself from parent', () => {
    const {
      parent,
      children: [child],
    } = prepareConnectedSubscriptions();
    child.unsubscribe();
    expect(child.getParent()).toBe(undefined);
    expect(parent.getChildren()).not.toContain(child);
  });

  test('unsubscribes from notifier', () => {
    const notifier = Notifier();
    const sub = notifier.subscribe();
    sub.unsubscribe();
    expect(sub.getNotifier()).toBeUndefined();
    expect(notifier.getSubscriptions()).not.toContain(sub);
  });

  test('unsubscribes children', () => {
    const { parent, children } = prepareConnectedSubscriptions();
    parent.unsubscribe();
    expect(parent.getChildren()).toEqual([]);
    children.forEach((child) => {
      expect(child.getNotifier()).toBeUndefined();
    });
  });
});

describe('next', () => {
  test('notifies subscriber', () => {
    const next = jest.fn();
    const subscription = Subscription({ next });
    const emittedValue = 'foo';
    subscription.next(emittedValue);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(emittedValue);
  });

  describe('no subscriber', () => {
    test("won't fail", () => {
      const subscription = Subscription();
      const emittedValue = 'foo';
      function harnessFn() {
        subscription.next(emittedValue);
      }
      expect(harnessFn).not.toThrowError();
    });
  });
});

function prepareConnectedSubscriptions() {
  const parent = Notifier().subscribe();
  const children = Array.from({ length: 5 }, () => Notifier().subscribe());
  children.forEach((child) => {
    parent.connect(child);
  });

  return { parent, children };
}
