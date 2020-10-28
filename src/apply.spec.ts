import { writable } from "svelte/store";
import { Stream } from "xstream";
import { apply } from "./apply";
import { doAfter } from "./utils/delay";
import { expectValuesInStream } from "./utils/expect-values";

const double = (i: number) => i * 2;
const triple = (i: number) => i * 3;

describe("apply", () => {
  it("should use function from store", (done) => {
    const values = Stream.periodic(10).take(3);
    const fns = writable(double);
    const result = apply(fns, values);

    expectValuesInStream(result, [0, 2, 4], done);
  });

  it("should use current function from store", (done) => {
    const values = Stream.periodic(10).take(3);
    const fns = writable(double);
    doAfter(25, () => fns.set(triple));
    const result = apply(fns, values);

    expectValuesInStream(result, [0, 2, 6], done);
  });
});
