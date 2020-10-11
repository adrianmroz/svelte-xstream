import { Stream } from "xstream";
import { Readable, readable } from "svelte/store";

export function accumB<T>(stream: Stream<T>, init: T): Readable<T> {
    return readable(init, set => {
        const sub = stream.subscribe({
            next: value => {
                set(value);
            }
        });
        return () => sub.unsubscribe();
    });
}