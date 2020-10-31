import { Stream } from "xstream";

export function tracker(
  eventType: string,
  options?: boolean | AddEventListenerOptions
) {
  const stream: Stream<Event> = Stream.empty();

  function tracker(node: HTMLElement) {
    const handler = (event: Event) => stream.shamefullySendNext(event);

    node.addEventListener(eventType, handler, options);

    return {
      destroy: () => {
        // node.removeEventListener(eventType, handler);
        stream.shamefullySendComplete();
      },
    };
  }

  return {
    stream,
    tracker,
  };
}
