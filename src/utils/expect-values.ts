import { Stream } from "xstream";
import { Readable } from "svelte/store";
import { delay } from "./delay";

type Sub = () => void;

function collect<T>(store: Readable<T>, into: T[]): Sub {
  return store.subscribe((value) => into.push(value));
}

export function expectValuesInStore<T>(store: Readable<T>, expected: T[]) {
  let result: T[] = [];
  const unsub = collect(store, result);
  unsub();
  expect(result).toStrictEqual(expected);
}

export async function waitAndExpectValuesInStore<T>(
  ms: number,
  store: Readable<T>,
  expected: T[],
  done: Function
) {
  let result: T[] = [];
  const unsub = collect(store, result);
  await delay(ms);
  unsub();
  expect(result).toStrictEqual(expected);
  done();
}

export function expectValuesInStream<T>(
  stream: Stream<T>,
  values: T[],
  done: Function
) {
  let expected = values.slice();
  stream.addListener({
    next(x: T) {
      expect(x).toStrictEqual(expected.shift());
    },
    error(err: unknown) {
      done(err);
    },
    complete() {
      expect(expected.length).toBe(0);
      done();
    },
  });
}
