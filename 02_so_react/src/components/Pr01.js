import io from "socket.io-client";
import { useEffect, useRef } from "react";

const socket = io.connect("http://localhost:8000", {autoConnect: false});
export default function Pr01(){
    const initSocketConnect = () => {
        if(!socket.connected) socket.connect();
    }

    useEffect(() => {
        initSocketConnect();

        socket.on("resHello", (res) => {
            console.log(res);
            resultMsg(res);
        });
    },[])

    const resultMsg = (res) => {
        result.current.innerText = res.msg;
    } 

    const hello = () => {
        socket.emit("hello", {msg: "hello"});
    }
    const result = useRef(null);

    return(<>
        <h3>Socket Practice 1</h3>
        <button onClick={hello}>hello</button>
        <p ref={result}></p>
    </>);
}