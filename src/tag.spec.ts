import { writable } from "svelte/store";
import { Stream } from "xstream";
import { tag } from "./tag";
import { doAfter } from "./utils/delay";
import { expectValuesInStream } from "./utils/expect-values";

describe("tag", () => {
  it("should sample value from store", (done) => {
    const events = Stream.periodic(10).take(4);
    const values = writable(42);
    const result = tag(values, events);

    expectValuesInStream(result, [42, 42, 42, 42], done);
  });

  it("should sample current value from store", (done) => {
    const events = Stream.periodic(10).take(4);
    const values = writable(42);
    doAfter(25, () => values.set(420));
    const result = tag(values, events);

    expectValuesInStream(result, [42, 42, 420, 420], done);
  });
});
