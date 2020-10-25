import { readable, Readable, writable } from "svelte/store";
import { Stream } from "xstream";
import { EmptyFn } from "./utils/function";
import { ManualStore } from "./manual-store";
import { onDestroy } from "svelte/internal";

export function switchHoldRC<T>(
  stream: Stream<Readable<T>>,
  init: T
): Readable<T> {
  return readable(init, (set) => {
    let innerUnsubscribe: EmptyFn | null = null;
    const subscription = stream.subscribe({
      next(store: Readable<T>) {
        innerUnsubscribe = store.subscribe(set);
      },
      error() {
        if (innerUnsubscribe) innerUnsubscribe();
      },
      complete() {
        if (innerUnsubscribe) innerUnsubscribe();
      },
    });
    return () => {
      if (innerUnsubscribe) innerUnsubscribe();
      subscription.unsubscribe();
    };
  });
}

export function switchHoldManual<T>(
  stream: Stream<Readable<T>>,
  init: T
): ManualStore<T> {
  const { set, subscribe } = writable(init);
  let innerUnsubscribe: EmptyFn | null = null;
  const subscription = stream.subscribe({
    next(store: Readable<T>) {
      innerUnsubscribe = store.subscribe(set);
    },
    error() {
      if (innerUnsubscribe) innerUnsubscribe();
    },
    complete() {
      if (innerUnsubscribe) innerUnsubscribe();
    },
  });

  const destroy = () => {
    if (innerUnsubscribe) innerUnsubscribe();
    subscription.unsubscribe();
  };

  return {
    subscribe,
    destroy,
  };
}

export function switchHoldAuto<T>(
  stream: Stream<Readable<T>>,
  init: T
): Readable<T> {
  const store = switchHoldManual(stream, init);
  onDestroy(() => store.destroy());
  return store;
}
