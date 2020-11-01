import { Stream } from "xstream";

export function tracker<K extends keyof HTMLElementEventMap>(
  eventType: K,
  options?: boolean | AddEventListenerOptions
) {
  const stream: Stream<Event> = Stream.never();

  function tracker(node: HTMLElement) {
    const handler = (event: HTMLElementEventMap[K]) =>
      stream.shamefullySendNext(event);

    node.addEventListener(eventType, handler, options);

    return {
      destroy: () => {
        node.removeEventListener(eventType, handler);
        stream.shamefullySendComplete();
      },
    };
  }

  return {
    stream,
    tracker,
  };
}
