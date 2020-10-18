import { Readable } from "svelte/store";

interface HasDestroy {
  destroy: () => void;
}

export type ManualStore<T, Store extends Readable<T> = Readable<T>> = Store &
  HasDestroy;
