import { get, Readable } from "svelte/store";
import { Stream } from "xstream";
import { Unary } from "./utils/function";

export function apply<S, T>(
  store: Readable<Unary<S, T>>,
  stream: Stream<S>
): Stream<T> {
  return stream.map((value) => {
    const f = get<Unary<S, T>, Readable<Unary<S, T>>>(store);
    return f(value);
  });
}
