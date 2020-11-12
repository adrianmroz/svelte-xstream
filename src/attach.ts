import { get, Readable } from "svelte/store";
import { Stream } from "xstream";

export function attach<S, T>(
  store: Readable<S>,
  stream: Stream<T>
): Stream<[S, T]> {
  return stream.map((eventValue) => {
    const storeValue = get<S, Readable<S>>(store);
    return [storeValue, eventValue];
  });
}
