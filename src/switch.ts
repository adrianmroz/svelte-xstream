import { Readable, readable } from "svelte/store";
import { Listener, Producer, Stream, Subscription } from "xstream";

export function switchE<T>(store: Readable<Stream<T>>): Stream<T> {
  let unsubscribe: () => void;
  let innerSubscription: Subscription | null = null;
  const producer: Producer<T> = {
    start(listener: Listener<T>) {
      unsubscribe = store.subscribe((stream) => {
        if (innerSubscription) innerSubscription.unsubscribe();
        innerSubscription = stream.subscribe(listener);
      });
    },
    stop() {
      if (innerSubscription) innerSubscription.unsubscribe();
      if (unsubscribe) unsubscribe();
    },
  };
  return Stream.create<T>(producer);
}

export function switchB<T>(store: Readable<Stream<T>>, init: T): Readable<T> {
  return readable(init, (set) => {
    let innerSubscription: Subscription | null = null;
    const unsubscribe = store.subscribe((stream) => {
      if (innerSubscription) innerSubscription.unsubscribe();
      innerSubscription = stream.subscribe({ next: set });
    });

    return () => {
      if (innerSubscription) innerSubscription.unsubscribe();
      unsubscribe();
    };
  });
}
