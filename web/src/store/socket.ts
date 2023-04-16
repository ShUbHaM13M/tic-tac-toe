
export interface ServerToClientEvents {
	noArg: () => void;
	"too-many-clients": () => void;
	"room-joined": ({ totalPlayers }: { totalPlayers: number }) => void;
	"player-joined": ({ totalPlayers }: { totalPlayers: number }) => void;
}

export interface ClientToServerEvents {
	move: ({ index, currentTurn }: { index: number, currentTurn: string }) => void;
	join: ({ roomID }: { roomID: string }) => void
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {

}