import { Readable, readable } from "svelte/store";
import { Stream, Subscription } from "xstream";

export function switchMap<S, T>(
  store: Readable<T>,
  f: (x: T) => Stream<S>,
  init: S
): Readable<S> {
  return readable(init, (set) => {
    let innerSubscription: Subscription;
    const unsubscribe = store.subscribe((x) => {
      const stream = f(x);
      if (innerSubscription) innerSubscription.unsubscribe();
      innerSubscription = stream.subscribe({ next: set });
    });
    return () => {
      if (innerSubscription) innerSubscription.unsubscribe();
      unsubscribe();
    };
  });
}
