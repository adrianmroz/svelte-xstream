import { Stream } from "xstream";
import { Readable, readable, writable } from "svelte/store";
import { onDestroy } from "svelte";

type ManualStore<T, S extends Readable<T> = Readable<T>> = S & { destroy: () => void };

export function accumRC<T>(stream: Stream<T>, init: T): Readable<T> {
    return readable(init, set => {
        const sub = stream.subscribe({
            next: value => {
                set(value);
            }
        });
        return () => sub.unsubscribe();
    });
}

export function accumManual<T>(stream: Stream<T>, init: T): ManualStore<T> {
    const { set, subscribe } = writable(init);
    const sub = stream.subscribe({
        next: value => {
            set(value);
        }
    });
    const destroy = () => sub.unsubscribe();

    return {
        subscribe,
        destroy
    };
}

export function accumAuto<T>(stream: Stream<T>, init: T): Readable<T> {
    const store = accumManual(stream, init);
    onDestroy(() => store.destroy());
    return store;
}