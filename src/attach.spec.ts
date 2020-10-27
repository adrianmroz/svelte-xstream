import { writable } from "svelte/store";
import { Stream } from "xstream";
import { attach } from "./attach";
import { doAfter } from "./utils/delay";
import { expectValuesInStream } from "./utils/expect-values";

describe("attach", () => {
  it("should attach value from store", (done) => {
    const events = Stream.periodic(10).take(2);
    const values = writable(42);
    const result = attach(values, events);
    const expected: Array<[number, number]> = [
      [42, 0],
      [42, 1],
    ];

    expectValuesInStream(result, expected, done);
  });

  it("should attach current value from store", (done) => {
    const events = Stream.periodic(10).take(3);
    const values = writable(42);
    doAfter(25, () => values.set(420));
    const result = attach(values, events);
    const expected: Array<[number, number]> = [
      [42, 0],
      [42, 1],
      [420, 2],
    ];

    expectValuesInStream(result, expected, done);
  });
});
