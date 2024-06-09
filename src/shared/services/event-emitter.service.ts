import { Injectable } from '@nestjs/common';
import type { TypeSafeEventEmitter } from 'typesafe-event-emitter';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import EventEmitter = require('events');

export enum EventEmitterEvents {}

interface IEventEmitterData {}

@Injectable()
export class EventEmitterService {
  private readonly eventEmitter: TypeSafeEventEmitter<IEventEmitterData> =
    new EventEmitter();

  constructor() {
    this.eventEmitter.setMaxListeners(0);
  }

  emit<K extends keyof IEventEmitterData>(
    event: K,
    payload: IEventEmitterData[K],
  ) {
    this.eventEmitter.emit(event, payload);
  }

  on<K extends keyof IEventEmitterData>(
    event: K,
    listener: (payload: IEventEmitterData[K]) => void,
  ) {
    this.eventEmitter.on(event, listener);
  }
}
