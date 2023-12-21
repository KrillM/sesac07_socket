const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors")
const port = 8000;

app.use(cors())

const io = require("socket.io")(server, {
    cors: {origin: "http://localhost:3000"}
})

server.listen(port, () => {
    console.log(`주소는 localhost:${port} 입니다.`);
})
