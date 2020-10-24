import { Readable, readable } from "svelte/store";
import { Stream, Subscription } from "xstream";

export function switchMap<S, T>(
  store: Readable<T>,
  f: (x: T) => Stream<S>,
  init: S
): Readable<S> {
  return readable(init, (set) => {
    let innerSub: Subscription;
    const unsub = store.subscribe((x) => {
      const stream = f(x);
      if (innerSub) innerSub.unsubscribe();
      innerSub = stream.subscribe({ next: set });
    });
    return () => {
      if (innerSub) innerSub.unsubscribe();
      unsub();
    };
  });
}
