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
    })

    socket.on("study", (res) => {
        console.log("Client", res);
    })

    socket.on("bye", (res) => {
        console.log("Client", res);
    })
})

server.listen(port, () => {
    console.log(`주소는 localhost:${port} 입니다.`);
});