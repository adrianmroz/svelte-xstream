import { Stream } from "xstream";
import { writable } from "svelte/store";
import { flatmapRC } from "./flatmap";
import { delay, doAfter } from "./utils/delay";
import { waitAndExpectValuesInStore } from "./utils/expect-values";

const delayedToFixed = (x: number) =>
  Stream.fromPromise<string>(delay(100).then(() => x.toFixed(2)));

describe("flatmap", () => {
  describe("flatmapRC", () => {
    it("base case", () => {
      const source = writable(0);
      const behaviour = flatmapRC(source, delayedToFixed, "0.00");
      doAfter(100, () => source.set(5));
      waitAndExpectValuesInStore(300, behaviour, ["0.00", "5.00"]);
    });

    it("switching case", () => {
      const source = writable(0);
      const behaviour = flatmapRC(source, delayedToFixed, "0.00");
      doAfter(100, () => source.set(5));
      doAfter(150, () => source.set(7));
      waitAndExpectValuesInStore(400, behaviour, ["0.00", "7.00"]);
    });
  });
});
