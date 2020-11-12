import { Stream } from "xstream";

type Options = Parameters<typeof addEventListener>[2];

export function tracker<K extends keyof HTMLElementEventMap>(
  eventType: K,
  options: Options
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
