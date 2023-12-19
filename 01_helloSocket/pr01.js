const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = 8000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pr01");
});

io.on("connection", (socket) => {
    socket.on("hello", (res) => {
        console.log("Client", res);
        socket.emit("resHello", {msg: "hello: 안녕하세요"});
    })

    socket.on("study", (res) => {
        console.log("Client", res);
        socket.emit("resStudy", {msg: "study: 공부하세요"});
    })

    socket.on("bye", (res) => {
        console.log("Client", res);
        socket.emit("resBye", {msg: "bye: 잘 가세요"});
    })
})

server.listen(port, () => {
    console.log(`주소는 localhost:${port} 입니다.`);
});