import { hookState, hookPostRenderEffect } from 'utils/jsx/hooks';
import { first } from 'utils/observable/transformations';
import { strictEquality } from 'utils/object';

/**
 * @template T
 * @param {import('utils/observable').Observable<T>} stream
 * @param {T} initialValue
 * @param {(v1:T, v2:T) => boolean} [checkEquality]
 */
export default function hookStream(
  stream,
  initialValue,
  checkEquality = strictEquality
) {
  const [currentValue, setValue] = hookState(initialValue);

  hookPostRenderEffect(() => {
    const sub = stream
      .transform(first((nextValue) => !checkEquality(currentValue, nextValue)))
      .subscribe({
        /** @param {T} nextValue */
        next(nextValue) {
          setValue(nextValue);
        },
      });

    return () => {
      sub.unsubscribe();
    };
  });

  return currentValue;
}
