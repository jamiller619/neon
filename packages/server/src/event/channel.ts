import { BroadcastChannel } from 'broadcast-channel'
import { EventMap } from 'typed-emitter'
import { BroadcastChannelEventMap } from './event-map'

type Channel = keyof BroadcastChannelEventMap

type Handler<T extends EventMap> = {
  event: keyof T
  handle: T[keyof T]
}

type BroadcastChannelEvent<T extends EventMap> = {
  name: keyof T
  params: Parameters<T[keyof T]>
}

class EventChannel<T extends EventMap> {
  #bc: BroadcastChannel<BroadcastChannelEvent<T>>
  #handlers: Handler<T>[] = []

  constructor(channel: Channel) {
    this.#bc = new BroadcastChannel(channel)

    this.#bc.onmessage = (event) => {
      const handler = this.#handlers.find((h) => h.event === event.name)

      if (handler) {
        handler.handle(...event.params)
      }
    }
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    this.#bc.postMessage({
      name: event,
      params: args,
    })
  }

  on<K extends keyof T>(event: K, handle: T[K]) {
    this.#handlers.push({
      event,
      handle,
    })
  }
}

export function getEventChannel<
  T extends Channel,
  E extends EventMap = BroadcastChannelEventMap[T],
>(channel: T): EventChannel<E> {
  return new EventChannel(channel)
}
