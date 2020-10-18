import { Readable, readable, writable } from "svelte/store";
import { Stream, Subscription } from "xstream";
import { onDestroy } from "svelte";
import { ManualStore } from "./manual-store";

export function flatmapRC<S, T>(
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

export function flatmapManual<S, T>(
  store: Readable<T>,
  f: (x: T) => Stream<S>,
  init: S
): ManualStore<S> {
  const { set, subscribe } = writable(init);
  let innerSub: Subscription;
  const unsubscribe = store.subscribe((x) => {
    const stream = f(x);
    if (innerSub) innerSub.unsubscribe();
    innerSub = stream.subscribe({ next: set });
  });

  const destroy = () => {
    if (innerSub) innerSub.unsubscribe();
    unsubscribe();
  };

  return {
    subscribe,
    destroy,
  };
}

export function flatmapAuto<S, T>(
  store: Readable<T>,
  f: (x: T) => Stream<S>,
  init: S
): Readable<S> {
  const behavior = flatmapManual(store, f, init);
  onDestroy(() => behavior.destroy());
  return behavior;
}
