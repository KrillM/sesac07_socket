const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = 8000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("client");
});

io.on("connection", (socket) => {
    console.log("socket id", socket.id);
    
    // on을 이용해 클라이언트에서 socket을 이용해 보내준 데이터를
    // 받을 이벤트를 등록한다.
    socket.on("krille", (res) => {
        console.log("res1 ", res);
        socket.emit("yena", {msg: "go away"})
    })

    socket.on("jisu", (res) => {
        console.log("res2 ", res);
        io.emit("notice", {
            msg: `${socket.id} 입장`
        });
    })
})

server.listen(port, () => {
    console.log(`주소는 localhost:${port} 입니다.`);
});