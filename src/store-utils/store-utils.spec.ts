import { of, map, flatten, flatMap, zip } from "./store-utils";
import {
  expectValuesInStore,
  waitAndExpectValuesInStore,
} from "../utils/expect-values";
import { writable } from "svelte/store";
import { doAfter } from "../utils/delay";
import { Stream } from "xstream";

describe("store-utils", () => {
  describe("of", () => {
    it("should create store with value", () => {
      const store = of(10);
      expectValuesInStore(store, [10]);
    });
  });

  describe("map", () => {
    const double = (i: number) => i * 2;

    it("should map all values with function", () => {
      const values = writable(1);
      const result = map(values, double);
      doAfter(10, () => values.set(2));
      waitAndExpectValuesInStore(20, result, [2, 4]);
    });
  });

  describe("zip", () => {
    const tuple = <S, T>(a: S, b: T): [S, T] => [a, b];

    it("should zip values from stores", () => {
      const numbers = writable(1);
      const strings = writable("a");
      const result = zip(numbers, strings, tuple);

      expectValuesInStore(result, [[1, "a"]]);
    });

    it("should zip current values from stores", () => {
      const numbers = writable(1);
      const strings = writable("a");
      const result = zip(numbers, strings, tuple);

      doAfter(10, () => numbers.set(2));
      doAfter(30, () => strings.set("b"));
      doAfter(40, () => numbers.set(3));

      const expected: Array<[number, string]> = [
        [1, "a"],
        [2, "a"],
        [2, "b"],
        [3, "b"],
      ];

      waitAndExpectValuesInStore(50, result, expected);
    });
  });
});
