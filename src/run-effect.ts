import { onDestroy } from "svelte";
import { Stream } from "xstream";
import { EmptyFn, Unary } from "./utils/function";

export function runEffect<T>(
  stream: Stream<T>,
  effect: Unary<T, void>,
  finalize?: EmptyFn
) {
  const subscription = stream.subscribe({
    next(value: T) {
      effect(value);
    },
    error() {
      if (finalize) finalize();
    },
    complete() {
      if (finalize) finalize();
    },
  });

  onDestroy(() => subscription.unsubscribe());
}
