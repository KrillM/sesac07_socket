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

        // includes: 문자열이나 배열에서 인자로 넘겨준 값의 존재 여부를 확인
        // indexOf: 배열에서 인자로 넘겨준 값의 인덱스를 추출, 없다면 -1 반환
        if(Object.values(crewIdarr).includes(res.crewId)){
            socket.emit("error", {msg: `이미 사용중인 아이디이므로 입장할 수 없습니다.`})
        }
        else {
            io.emit("notice", {msg: `${res.crewId}님이 입장하였습니다.`})
            socket.emit("entrySuccess", {crewId: res.crewId})
            crewIdarr[socket.id] = res.crewId;
        }

        // io.emit("notice", {msg: `${res.crewId}님이 입장하였습니다.`})    
        console.log(crewIdarr);
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