import { Stream } from "xstream";

export function tracker<T extends Event = Event>(
  eventType: string,
  options?: boolean | AddEventListenerOptions
) {
  const stream: Stream<T> = Stream.empty();

  function tracker(node: HTMLElement) {
    const handler = (event: T) => stream.shamefullySendNext(event);

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
