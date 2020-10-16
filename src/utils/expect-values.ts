import { Readable } from "svelte/store";
import { delay } from "./delay";

type Sub = () => void;

function collect<T>(store: Readable<T>, into: T[]): Sub {
  return store.subscribe(value => into.push(value));
}

export function expectValuesInStore<T>(store: Readable<T>, expected: T[]) {
  let result: T[] = [];
  const unsub = collect(store, result);
  unsub();
  expect(result).toEqual(expected);
}

export async function waitAndExpectValuesInStore<T>(ms: number, store: Readable<T>, expected: T[]) {
  let result: T[] = [];
  const unsub = collect(store, result);
  await delay(ms);
  unsub();
  expect(result).toEqual(expected);
}