import { writable } from "svelte/store";
import { toStream } from "./to-stream";
import { doAfter } from "./utils/delay";
import { expectValuesInStream } from "./utils/expect-values";

describe("toStream", () => {
  it("should emit same events as store", (done) => {
    const { set, ...readable } = writable(0);
    const stream = toStream(readable);

    doAfter(0, () => set(1));
    doAfter(0, () => set(2));
    doAfter(0, () => set(3));
    doAfter(0, () => set(4));
    doAfter(0, () => stream.shamefullySendComplete());

    expectValuesInStream(stream, [0, 1, 2, 3, 4], done);
  });
});
