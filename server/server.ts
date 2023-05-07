
import Koa from 'koa';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = new Koa();

const server = createServer(app.callback())
const io = new SocketIOServer(server, {
  cors: {
    origin: "*"
  }
})

app.use(async ctx => {
  ctx.body = "Hello World!";
})

const winMatrix = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkBoard(state: Array<string | undefined>) {
  for (let index = 0; index < 8; index++) {
    if (
      state[winMatrix[index][0]] == "X" &&
      state[winMatrix[index][1]] == "X" &&
      state[winMatrix[index][2]] == "X"
    ) {
      return { winner: "X", winMatrixIndex: index }
    }
  }

  for (let index = 0; index < 8; index++) {
    if (
      state[winMatrix[index][0]] == "O" &&
      state[winMatrix[index][1]] == "O" &&
      state[winMatrix[index][2]] == "O"
    ) {
      return { winner: "O", winMatrixIndex: index }
    }
  }

  return null

}

const games = new Map<string, {
  currentTurn: string,
  totalPlayers: number,
  board: Array<undefined | string>;
}>();

io.on('connection', (socket: Socket) => {
  console.log(`${ socket.id }: connected`)
  let joinedRoom: string | null = null

  socket.on("move", ({ index, roomID, currentTurn }) => {
    const gameState = games.get(roomID)!

    if (gameState?.board[index] !== undefined) return
    gameState.board[index] = gameState.currentTurn

    if (currentTurn === "X") {
      games.set(roomID, { ...gameState, currentTurn: "O" })
    } else {
      games.set(roomID, { ...gameState, currentTurn: "X" })
    }

    io.to(roomID).emit(
      "move-played",
      {
        gameState: games.get(roomID),
      }
    );

    const winState = checkBoard(gameState.board)
    if (winState) {
      io.to(roomID).emit("game-won", winState)
    }
  })

  socket.on("hover", ({ cellNumber, roomID }) => {
    socket.broadcast.to(roomID).emit("player-hovering", { cellNumber })
  })

  socket.on("join", ({ roomID }) => {
    const connectedClients = io.sockets.adapter.rooms.get(roomID)
    joinedRoom = roomID

    if (!connectedClients) {
      socket.join(roomID)
      games.set(roomID, {
        currentTurn: "X",
        totalPlayers: 1,
        board: Array.from<undefined | string>({ length: 9 }).fill(undefined)
      })
      socket.emit("room-joined", { totalPlayers: 1, assignedTurn: "X", currentTurn: "X" })
      return
    }
    if (connectedClients?.size >= 2) {
      console.log("2 players already connected")
      socket.emit("too-many-clients")
      return
    }
    socket.join(roomID)
    socket.emit("room-joined", { totalPlayers: connectedClients.size, assignedTurn: "O", currentTurn: "X" })
    socket.broadcast.to(roomID).emit("player-joined", { totalPlayers: connectedClients.size, currentTurn: "X" })
    setTimeout(() => {
      io.to(roomID).emit("start-game")
    }, 5000)
  })

  socket.on("disconnect", () => {
    console.log(`${ socket.id }: disconnected`)
    if (joinedRoom) {
      const totalPlayers = io.sockets.adapter.rooms.get(joinedRoom)
      if (totalPlayers?.size) return
      games.delete(joinedRoom)
    }
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server listening on: localhost:${ PORT }`)
});
