import { Stream } from "xstream";
import { accumRC } from "./accum";
import { delay } from "./utils/delay";
import { expectValuesInStore, waitAndExpectValuesInStore } from "./utils/expect-values";

describe("accum", () => {
  describe("accumRC", () => {
    it("should get initial value for empty stream", () => {
      const stream = Stream.never<number>();
      const behaviour = accumRC<number>(stream, 0);
      expectValuesInStore<number>(behaviour, [0]);
    });

    it("should get immediately value from synchronous stream", () => {
      const stream = Stream.of<number>(1);
      const behaviour = accumRC<number>(stream, 0);
      expectValuesInStore<number>(behaviour, [1]);
    });

    it("should get initial value and delayed from async stream", async () => {
      const stream = Stream.fromPromise<number>(delay(10).then(() => 1));
      const behaviour = accumRC<number>(stream, 0);
      waitAndExpectValuesInStore(10, behaviour, [0, 1]);
    });
  });
});