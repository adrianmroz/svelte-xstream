import { Stream } from "xstream";
import { get } from "svelte/store";
import { accumB } from "./index";

describe("accumB", () => {
  it("works", () => {
    const stream = Stream.of(1);
    const behaviour = accumB(stream, 0);
    const value = get(behaviour);
    expect(value).toEqual(1);
  });
});
