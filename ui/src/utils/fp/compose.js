import identity from './identity';

export default function compose(...fns) {
  return fns.reduceRight(
    (fn1, fn2) =>
      function composed(arg) {
        return fn2(fn1(arg));
      },
    identity
  );
}
