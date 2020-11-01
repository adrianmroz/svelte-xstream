import { get, Readable } from "svelte/store";
import { Stream } from "xstream";
import { Unary } from "./utils/function";

type Predicate<T> = Unary<T, boolean>;

export function filterApply<T>(
  store: Readable<Predicate<T>>,
  stream: Stream<T>
): Stream<T> {
  return stream.filter((value) => {
    const predicate = get<Predicate<T>, Readable<Predicate<T>>>(store);
    return predicate(value);
  });
}
