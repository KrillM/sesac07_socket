import "./chat.css";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import Notice from "./Notice";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000", {autoConnect: false});
export default function Chat02(){
    const [msgInput, setMsgInput] = useState("");
    const [newCrewInput, setNewCrewInput] = useState("");
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

    const [crewId, setCrewId] = useState(null);

    const initSocketConnect = () => {
        console.log("connected", socket.connected)
        if(!socket.connected) socket.connect()
    }

    useEffect(() => {
        // joinTheChat();
        socket.on("error", (res) => {
            alert(res.msg);
        })

        socket.on("entrySuccess", (res) => {
            setCrewId(res.crewId);
        })
    }, [])

    useEffect(() => {
        const notice = (res) => {
            console.log("notice")
            const newChatList = [...chatList, {type: "notice", content: res.msg}]
            setChatList(newChatList);       
        }

        socket.on("notice", notice);
        return () => socket.off("notice", notice);
    }, [chatList])

    const sendMsg = () =>{}
    const joinTheChat = () => {
        initSocketConnect();
        socket.emit("entry", {crewId: newCrewInput});
        // setCrewId(newCrewInput)
    }

    return(<>
        { crewId ? (<>
            <div className="chat-container">
                {chatList.map((chat, i) => {
                    if(chat.type === "notice") return <Notice key={i} chat={chat}/>
                    else return <Chat key={i} chat={chat} />
                })}
            </div>

            <div className="input-container">
                <input type="text" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
                <button onClick={sendMsg}>전송</button>
            </div>
        </>) : (
            <div className="input-container">
                <input type="text" value={newCrewInput} onChange={(e) => setNewCrewInput(e.target.value)} />
                <button onClick={joinTheChat}>선수 입장</button>
            </div>
        )}
        
    </>);
}