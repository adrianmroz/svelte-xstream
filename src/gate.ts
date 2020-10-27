import { get, Readable } from "svelte/store";
import { Stream } from "xstream";

export function gate<T>(
  store: Readable<boolean>,
  stream: Stream<T>
): Stream<T> {
  return stream.filter(() => {
    const condition = get(store);
    return condition;
  });
}
