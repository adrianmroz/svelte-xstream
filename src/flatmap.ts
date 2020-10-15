import { Readable, readable, writable } from "svelte/store";
import { Stream, Subscription } from "xstream";
import { onDestroy } from "svelte";
import { ManualStore } from "./manual-store";

export function flatmapRC<S, T>(
  store: Readable<T>, 
  f: (x: T) => Stream<S>,
  init: S
): Readable<S> {
  return readable(init, set => {
    let innerSub: Subscription;
    const unsub = store.subscribe(x => {
      const stream = f(x);
      if (innerSub) innerSub.unsubscribe();
      innerSub = stream.subscribe({
        next: value => {
          set(value);
        }
      });
    });
    return () => {
      if (innerSub) innerSub.unsubscribe();
      unsub();
    }
  });
}