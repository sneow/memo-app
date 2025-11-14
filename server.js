const WebSocket = require("ws");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public")); // index.html과 script.js가 public 폴더 안에 있어야 함

const server = app.listen(port, () => console.log(`Server running on port ${port}`));

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.send("익명 메모장에 접속했습니다.");

  ws.on("message", (msg) => {
    // 모든 클라이언트에게 전송
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("누군가 나갔습니다.");
      }
    });
  });
});
