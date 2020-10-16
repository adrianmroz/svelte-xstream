import { Stream } from "xstream";
import { Readable, readable, writable } from "svelte/store";
import { onDestroy } from "svelte";
import { ManualStore } from "./manual-store";

export function foldpRC<S, T>(stream: Stream<S>, reducer: (acc: T, next: S) => T, init: T): Readable<T> {
  let lastValue: T = init;
  return readable<T>(init, set => {
    const subscription = stream.subscribe({
      next: value => {
        lastValue = reducer(lastValue, value);
        set(lastValue);
      }
    });
    return () => subscription.unsubscribe();
  });
}

export function foldpManual<S, T>(stream: Stream<S>, reducer: (acc: T, next: S) => T, init: T): ManualStore<T> {
  let lastValue: T = init;
  const { set, subscribe } = writable<T>(init);
  const subscription = stream.subscribe({
    next: value => {
        lastValue = reducer(lastValue, value);
        set(lastValue);
    }
  });
  const destroy = () => subscription.unsubscribe();

  return {
    subscribe,
    destroy
  };
}

export function foldpAuto<S, T>(stream: Stream<S>, reducer: (acc: T, next: S) => T, init: T): Readable<T> {
  const store = foldpManual(stream, reducer, init);
  onDestroy(() => store.destroy());
  return store;
}