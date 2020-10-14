import { Stream } from "xstream";
import { get } from "svelte/store";
import { accumRC } from "./accum";
import { noop } from "./utils/noop";
import { delay } from "./utils/delay";

describe("accum", () => {
  describe("accumRC", () => {
    it("sync case", () => {
      const stream = Stream.of(1);
      const behaviour = accumRC(stream, 0);
      const value = get(behaviour);
      expect(value).toEqual(1);
    });

    it("async case", async () => {
      const stream = Stream.fromPromise(delay(10).then(() => 1));
      const behaviour = accumRC(stream, 0);
      // need sub to keep stream running
      const unsub = behaviour.subscribe(noop);
      const value = get(behaviour);
      expect(value).toEqual(0);
      await delay(10);
      const newValue = get(behaviour);
      expect(newValue).toEqual(1);
      unsub();
    });
  });
});