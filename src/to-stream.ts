import { Readable } from 'svelte/store';
import { Stream, Producer, Listener } from 'xstream';

export function toStream<T>(store: Readable<T>): Stream<T> {
  let unsub: (() => void) | null = null;
  const producer: Producer<T> = {
    start(listener: Listener<T>) {
      unsub = store.subscribe(value => listener.next(value));
    },
    stop() {
      if (unsub) unsub();
    }
  };
  return Stream.create<T>(producer);
}