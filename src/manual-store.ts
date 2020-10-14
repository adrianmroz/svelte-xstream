import { Readable } from "svelte/store";

export type ManualStore<T, S extends Readable<T> = Readable<T>> = S & { destroy: () => void };
