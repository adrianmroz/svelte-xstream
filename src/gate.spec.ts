import { writable } from "svelte/store";
import { Stream } from "xstream";
import { gate } from "./gate";
import { doAfter } from "./utils/delay";
import { expectValuesInStream } from "./utils/expect-values";

describe("gate", () => {
  it("should pass all values if store value is true", (done) => {
    const values = Stream.periodic(10).take(4);
    const conditions = writable(true);
    const result = gate(conditions, values);

    expectValuesInStream(result, [0, 1, 2, 3], done);
  });

  it("should not pass any value if store value is false", (done) => {
    const values = Stream.periodic(10).take(4);
    const conditions = writable(false);
    const result = gate(conditions, values);

    expectValuesInStream(result, [], done);
  });

  it("should pass all values till store value is true", (done) => {
    const values = Stream.periodic(10).take(4);
    const conditions = writable(true);
    doAfter(25, () => conditions.set(false));
    const result = gate(conditions, values);

    expectValuesInStream(result, [0, 1], done);
  });

  it("should not pass any value till store value is false", (done) => {
    const values = Stream.periodic(10).take(4);
    const conditions = writable(false);
    doAfter(25, () => conditions.set(true));
    const result = gate(conditions, values);

    expectValuesInStream(result, [2, 3], done);
  });
});
