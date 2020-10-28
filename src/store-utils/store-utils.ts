import { readable, Readable, derived, writable, get } from "svelte/store";
import { EmptyFn, Unary, Binary } from "../utils/function";

export function map<S, T>(store: Readable<S>, f: Unary<S, T>): Readable<T> {
  return derived(store, f);
}

export function zip<S, T, U>(
  storeA: Readable<S>,
  storeB: Readable<T>,
  f: Binary<S, T, U>
): Readable<U> {
  return derived([storeA, storeB], ([a, b]) => f(a, b));
}

export function of<T>(value: T): Readable<T> {
  return writable(value);
}

export function flatten<T>(store: Readable<Readable<T>>): Readable<T> {
  const init = get(get(store));
  return readable(init, (set) => {
    let innerUnsubscribe: EmptyFn | null = null;
    const unsubscribe = store.subscribe((innerStore) => {
      innerUnsubscribe = innerStore.subscribe(set);
    });

    return () => {
      if (innerUnsubscribe) innerUnsubscribe();
      unsubscribe();
    };
  });
}

export function flatMap<S, T>(
  store: Readable<S>,
  f: Unary<S, Readable<T>>
): Readable<T> {
  const firstValue: S = get(store);
  const init: T = get(f(firstValue));
  return readable(init, (set) => {
    let innerUnsubscribe: EmptyFn | null = null;
    const unsubscribe = store.subscribe((value) => {
      const innerStore = f(value);
      innerUnsubscribe = innerStore.subscribe(set);
    });

    return () => {
      if (innerUnsubscribe) innerUnsubscribe();
      unsubscribe();
    };
  });
}
