import ArrayStream from './array-stream';

test('emits elements sequentially when subscribed', () => {
  const array = [1, 2, 'foo', true];
  const stream = ArrayStream(array);

  const next = jest.fn();
  stream.subscribe({ next });
  expect(next).toHaveBeenCalledTimes(array.length);
  array.forEach((v) => {
    expect(next).toHaveBeenCalledWith(v);
  });

  next.mockReset();
  stream.subscribe({ next });
  expect(next).toHaveBeenCalledTimes(array.length);
  array.forEach((v) => {
    expect(next).toHaveBeenCalledWith(v);
  });
});
