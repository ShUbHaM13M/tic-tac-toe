import type { Socket } from 'socket.io-client';
import { writable } from 'svelte/store'
import type { ClientToServerEvents, ServerToClientEvents } from './socket';
import type { TurnType } from '../lib/Board.svelte';

export enum MessageType {
	SUCCESS = 0,
	ERROR = 1,
}

interface Message {
	label: string,
	type: MessageType
}

export const socket = writable<Socket<ServerToClientEvents, ClientToServerEvents>>();
export const flash = writable<Message>();
export const currentGame = writable<{ roomID: string, assignedTurn: TurnType, currentTurn: TurnType, state: Array<undefined | TurnType> }>();