import { Stream } from "xstream";
import { get } from "svelte/store";
import { accumRC } from "./index";

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
}

function noop(a: any): void { }

describe("accumRC", () => {
  it("sync case", () => {
    const stream = Stream.of(1);
    const behaviour = accumRC(stream, 0);
    const value = get(behaviour);
    expect(value).toEqual(1);
  });

  it("async case", async () => {
    const stream = Stream.fromPromise(delay(10, 1));
    const behaviour = accumRC(stream, 0);
    // need sub to keep stream running
    const unsub = behaviour.subscribe(noop);
    const value = get(behaviour);
    expect(value).toEqual(0);
    await delay(10, null);
    const newValue = get(behaviour);
    expect(newValue).toEqual(1);
    unsub();
  });
});
