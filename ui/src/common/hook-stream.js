import { hookState, hookPostRenderEffect } from 'utils/jsx/hooks';
import { first } from 'utils/streams/transformations';
import { strictEquality } from 'utils/object';

/**
 * @template T
 * @param {import('utils/streams/types').Stream<T>} stream
 * @param {T} initialValue
 * @param {(v1:T, v2:T) => boolean} [checkEquality]
 */
export default function hookStream(
  stream,
  initialValue,
  checkEquality = strictEquality
) {
  const [currentValue, setValue] = hookState(initialValue);

  hookPostRenderEffect(
    () => {
      stream
        .transform(first((nextValue) => !checkEquality(currentValue, nextValue)))
        .subscribe({
          /** @param {T} nextValue */
          next(nextValue) {
            setValue(nextValue);
          },
        });
    },
    [currentValue]
  );

  return currentValue;
}
