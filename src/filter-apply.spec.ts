import { writable } from "svelte/store";
import { Stream } from "xstream";
import { filterApply } from "./filter-apply";
import { doAfter } from "./utils/delay";
import { expectValuesInStream } from "./utils/expect-values";

const isOdd = (i: number) => i % 2 === 1;
const isLessThan5 = (i: number) => i < 5;

describe("filterApply", () => {
  it("should use predicate from store", (done) => {
    const values = Stream.periodic(10).take(4);
    const predicates = writable(isOdd);
    const result = filterApply(predicates, values);

    expectValuesInStream(result, [1, 3], done);
  });

  it("should use current predicate from store", (done) => {
    const values = Stream.periodic(10).take(4);
    const predicates = writable(isOdd);
    doAfter(25, () => predicates.set(isLessThan5));
    const result = filterApply(predicates, values);

    expectValuesInStream(result, [1, 2, 3], done);
  });
});
