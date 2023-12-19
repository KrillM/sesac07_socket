import "./chat.css";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import Notice from "./Notice";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000", {autoConnect: false});
export default function Chat01(){
    const [msgInput, setMsgInput] = useState("");
    const [chatList, setChatList] = useState([
        {
            type: "my",
            content: "안녕?"
        }, {
            type: "your",
            content: "어 안녕"
        }, {
            type: "notice",
            content: "OOO님이 입장하였습니다."
        },
    ]);

    const initSocketConnect = () => {
        console.log("connected", socket.connected)
        if(!socket.connected) socket.connect()
    }

    useEffect(() => {
        initSocketConnect();

        // 문제 1. chatList 변경 때마다 기존 chatList만 이용 한다.
        // socket.on("notice", (res) => {
        //     const newChatList = [...chatList, {type: "notice", content: res.msg}]
        //     setChatList(newChatList); 
        // })
    }, [])

    useEffect(() => {
        const notice = (res) => {
            // 해결 1. chatList가 변경할 때마다 event를 다시 생성한다.
            // 문제 2. notice 이벤트가 변경될 때마다 누적된다.
            // socket.on("notice", (res) => {
            //     const newChatList = [...chatList, {type: "notice", content: res.msg}]
            //     setChatList(newChatList); 
            // })

            // 해결 2. return을 사용하여 notice 이벤트를 제거한 후 다시 생성하도록 한다.
            console.log("notice")
            const newChatList = [...chatList, {type: "notice", content: res.msg}]
            setChatList(newChatList);       
        }

        socket.on("notice", notice);
        return () => socket.off("notice", notice);
    }, [chatList])

    const sendMsg =() =>{}

    return(<>
        <div className="chat-container">
            {chatList.map((chat, i) => {
                if(chat.type === "notice") return <Notice key={i} chat={chat}/>
                else return <Chat key={i} chat={chat} />
            })}
        </div>

        <div className="input-container">
            <input type="text" value={msgInput} onClick={(e) => setMsgInput(e.target.value)} />
            <button onClick={sendMsg}>전송</button>
        </div>
    </>);
}