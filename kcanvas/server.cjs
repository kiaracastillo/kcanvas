// WebSocket signaling server for realtime drawing collaboration
const WebSocket = require("ws");

//port configuration
const PORT = 3001;
const server = new WebSocket.Server({ port: PORT });

// room management
const rooms = {};

// handle incoming connections
server.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    let msg;

  try {
      msg = JSON.parse(data.toString());
    } catch (err) {

      console.error("Error parsing message", err);
      return;
    }

    //join room message

    if (msg.type === "join-room") {

      const roomId = msg.roomId;
     
 if (!rooms[roomId]) {
        rooms[roomId] = { clients: new Set(), lastSketch: null };
      }

 rooms[roomId].clients.add(ws);
   ws.roomId = roomId;

      console.log(`joined room: ${roomId}`);

      //if there's a last AI sketch send it to the newly joined client
      if (rooms[roomId].lastSketch) {

        //send the last sketch to the newly joined client
        ws.send(
          JSON.stringify({
            type: "ai-sketch",
            roomId,
            payload: rooms[roomId].lastSketch,
    }
        )
        );
      }

      return;
    }

    //broadcast messages to other clients in the same room
    if (ws.roomId) {
      const roomId = ws.roomId;
      const room = rooms[roomId];
      if (!room) return;

      // Si es un sketch ai generado guardarlo como el ultimo sketch del room
      if (msg.type === "ai-sketch" && msg.payload?.imageBase64) {

        room.lastSketch = msg.payload;
      }

      room.clients.forEach((client) => {
    
    if (client !== ws && client.readyState === WebSocket.OPEN) {

          client.send(JSON.stringify(msg));
        }

      }
    );
    }
  }
);

  ws.on("close", () => {

    console.log("Client disconnected");
    if (ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId].clients.delete(ws);

    }
  }
);
}
);

console.log(`WebSocket signaling server running on ws://localhost:${PORT}`);

