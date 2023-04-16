
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

const win_matrix = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

io.on('connection', (socket: Socket) => {
  console.log(`${ socket.id }: connected`)

  socket.on("move", ({ index, currentTurn }) => {
    console.log(index, currentTurn)
  })

  socket.on("hover", ({ cellNumber, roomID }) => {
    socket.broadcast.to(roomID).emit("player-hovering", { cellNumber })
  })

  socket.on("join", ({ roomID }) => {
    const connectedClients = io.sockets.adapter.rooms.get(roomID)

    if (!connectedClients) {
      socket.join(roomID)
      socket.emit("room-joined", { totalPlayers: 1 })
      return
    }
    if (connectedClients?.size >= 2) {
      console.log("2 players already connected")
      socket.emit("too-many-clients")
      return
    }
    socket.join(roomID)
    socket.emit("room-joined", { totalPlayers: connectedClients.size })
    socket.broadcast.to(roomID).emit("player-joined", { totalPlayers: connectedClients.size })
    setTimeout(() => {
      io.to(roomID).emit("start-game")
    }, 5000)
  })

  socket.on("disconnect", () => {
    console.log(`${ socket.id }: disconnected`)
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server listening on: localhost:${ PORT }`)
});
