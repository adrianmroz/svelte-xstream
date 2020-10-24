import { get, Readable } from "svelte/store";
import { Stream } from "xstream";

export function tag<S, T>(store: Readable<S>, stream: Stream<T>): Stream<S> {
  return stream.map((_) => {
    const value = get(store);
    return value;
  });
}
