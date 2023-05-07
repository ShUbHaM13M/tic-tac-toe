import type { TurnType } from "../lib/Board.svelte";

export interface ServerToClientEvents {
	noArg: () => void;
	"too-many-clients": () => void;
	"room-joined": ({ totalPlayers }: { totalPlayers: number, assignedTurn: TurnType, currentTurn: TurnType }) => void;
	"player-joined": ({ totalPlayers }: { totalPlayers: number }) => void;
	"player-hovering": ({ cellNumber }: { cellNumber: number }) => void;
	"move-played": ({ cellNumber, gameState }: { cellNumber: number, gameState: any }) => void;
	"game-won": ({ winner, winMatrixIndex }: { winner: TurnType, winMatrixIndex: number }) => void;
}

export interface ClientToServerEvents {
	move: ({ index, roomID }: { index: number, roomID: string, currentTurn: TurnType }) => void;
	join: ({ roomID, username }: { roomID: string, username: string }) => void;
	hover: ({ cellNumber, roomID }: { cellNumber: number, roomID: string }) => void
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {

}