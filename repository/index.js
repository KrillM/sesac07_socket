const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors")
const port = 8000;

app.use(cors())

const crewTable = {};
const updateTableCrew = () => {
    io.emit("crewList", crewTable)
}

const io = require("socket.io")(server, {
    cors: {origin: "http://localhost:3000"}
})

io.on("connection", (socket) => {
    socket.on("entry", (res) => {
        io.emit("notice", {message: `${res.crewName}님이 입장하였습니다.`})
        socket.emit("entried", {crewName: res.crewName})
        crewTable[socket.id] = res.crewName;
        updateTableCrew();
    })
})

server.listen(port, () => {
    console.log(`주소는 localhost:${port} 입니다.`);
})
