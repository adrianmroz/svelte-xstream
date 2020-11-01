import { get, Readable } from "svelte/store";
import { Stream } from "xstream";

export function tag<S, T>(store: Readable<S>, stream: Stream<T>): Stream<S> {
  return stream.map(() => {
    const value = get<S, Readable<S>>(store);
    return value;
  });
}
