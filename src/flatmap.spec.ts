import { Stream } from "xstream";
import { writable } from "svelte/store";
import { flatmapRC } from "./flatmap";
import { delay } from "./utils/delay";
import { expectValues, expectValuesAfter } from "./utils/expect-values";

function doAfter(ms: number, f: () => void) {
  delay(ms).then(f);
}

const delayedToFixed = (x: number) =>
        Stream.fromPromise<string>(
          delay(100)
            .then(() => x.toFixed(2)));
      

describe("flatmap", () => {
  describe("flatmapRC", () => {
    it("base case", () => {
      const source = writable(0);
      const behaviour = flatmapRC(source, delayedToFixed, "0.00");
      doAfter(100, () => source.set(5));
      expectValuesAfter(behaviour, ["0.00", "5.00"], 300);
    });

    it("switching case", () => {
      const source = writable(0);
      const behaviour = flatmapRC(source, delayedToFixed, "0.00");
      doAfter(100, () => source.set(5));
      doAfter(150, () => source.set(7));
      expectValuesAfter(behaviour, ["0.00", "7.00"], 400);
    });
  });
});
