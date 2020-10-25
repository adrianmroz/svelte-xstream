import { get, Readable } from "svelte/store";
import { Stream } from "xstream";
import { Unary } from "./utils/function";

export function filterApply<T>(
  store: Readable<Unary<T, boolean>>,
  stream: Stream<T>
): Stream<T> {
  return stream.filter((value) => {
    const predicate = get(store);
    return predicate(value);
  });
}
