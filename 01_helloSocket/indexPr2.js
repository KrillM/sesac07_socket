const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const port = 8000;

app.use(cors());

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

const crewIdarr = {};
// {"socket.id" : "crewId"}

io.on("connection", (socket) => {

    // 입장할 때 받은 아이디로 입장을 공지한다.
    socket.on("entry", (res) => {
        crewIdarr[socket.id] = res.crewId;
        io.emit("notice", {msg: `${res.crewId}님이 입장하였습니다.`})
    })

    socket.on("disconnect", (res) => {
        io.emit("notice", {msg: `${crewIdarr[socket.id]}님이 나갔습니다.`})
        delete crewIdarr[socket.id];
    })
})

server.listen(port, () => {
    console.log("crewIdarr ", crewIdarr);
    console.log(`주소는 localhost:${port} 입니다.`);
});