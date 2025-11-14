const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });
console.log("WebSocket 서버 실행 중 (3001 포트)");

// 관리자 전용 로그 (콘솔에만 표시됨)
function adminLog(message) {
    console.log("[관리자 로그] " + message);
}

wss.on("connection", (ws) => {
    // 랜덤 익명 사용자 이름 부여
    const randomName = "익명" + Math.floor(Math.random() * 10000);
    ws.username = randomName;

    // 관리자만 보는 기록
    adminLog(`${ws.username} 접속함`);

    // 다른 사용자들에게 알림
    broadcast({ type: "join", name: ws.username });

    // 연결 종료 처리
    ws.on("close", () => {
        adminLog(`${ws.username} 나감`);
        broadcast({ type: "leave", name: ws.username });
    });
});

// 전체 사용자에게 메시지 전송
function broadcast(msg) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}
