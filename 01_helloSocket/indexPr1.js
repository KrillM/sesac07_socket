const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

// cors issue: 다른 서버에서 보내는 요청을 제한한다.
const cors = require("cors");
const port = 8000;

app.use(cors());

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        // methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("socket id ", socket.id);

    socket.on("hello", (res) => {
        console.log("Client", res);
        socket.emit("resHello", {msg: "hello: 안녕하세요"});
    })
})

server.listen(port, () => {
    console.log(`주소는 localhost:${port} 입니다.`);
});