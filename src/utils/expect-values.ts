import { Readable } from "svelte/store";
import { delay } from "./delay";

type Sub = () => void;

function collect<T>(store: Readable<T>, into: T[]): Sub {
  return store.subscribe(value => into.push(value));
}

export function expectValues<T>(store: Readable<T>, expected: T[]) {
  let result: T[] = [];
  const unsub = collect(store, result);
  expect(result).toEqual(expected);
  unsub();
}

export async function expectValuesAfter<T>(store: Readable<T>, expected: T[], ms: number) {
  let result: T[] = [];
  const unsub = collect(store, result);
  await delay(ms);
  expect(result).toEqual(expected);
  unsub();
}