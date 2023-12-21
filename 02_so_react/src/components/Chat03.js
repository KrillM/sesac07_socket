import "./chat.css";
import { useCallback, useEffect, useState, useMemo } from "react";
import Chat from "./Chat";
import Notice from "./Notice";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000", {autoConnect: false});
export default function Chat03(){
    const [msgInput, setMsgInput] = useState("");
    const [newCrewInput, setNewCrewInput] = useState("");
    const [chatList, setChatList] = useState([]);
    const [crewId, setCrewId] = useState(null);
    const [crewList, setCrewList] = useState({})
    const [dm2, setDm2] = useState("all");

    const initSocketConnect = () => {
        console.log("connected", socket.connected)
        if(!socket.connected) socket.connect()
    }

    useEffect(() => {
        socket.on("error", (res) => {
            alert(res.msg);
        })

        socket.on("entrySuccess", (res) => {
            setCrewId(res.crewId);
        })
        
        socket.on('crewList', (res) => {
            setCrewList(res)
        })
    }, [])

    // useMemo: 값을 메모라이징 한다.
    // 뒤에 있는 의존성 배열에 있는 값이 update 될 때마다 연산을 실행한다.
    const crewListOptions = useMemo(() => {
        const options = []
        for(const key in crewList){
            if(crewList[key] === crewId) continue;
            options.push(<option key={key} value={key}>{crewList[key]}</option>)
        }
        return options
    }, [crewList])

    // 함수 메모라이징 (useCallback) - 뒤에 있는 의존성 배열에 있는 값이 update 될 때만 함수를 다시 선언한다.
    const addChatList = useCallback ((res) => {
        const type = res.crewId === crewId ? "my" : "your";
        const content = `${res.dm ? '(속닥속닥)' : ''} ${res.crewId}: ${res.msg}`
        const newChatList = [...chatList, {type: type, content: content}]
        setChatList(newChatList);
    }, [crewId, chatList])

    useEffect(() => {
        socket.on("chat". addChatList);
        return () => socket.off("chat", addChatList)
    },[addChatList])

    socket.on("chat", addChatList);

    useEffect(() => {
        const notice = (res) => {
            const newChatList = [...chatList, {type: "notice", content: res.msg}]
            setChatList(newChatList);       
        }

        socket.on("notice", notice);
        return () => socket.off("notice", notice);
    }, [chatList])

    const sendMsg = () => {
        if(msgInput !== "") {
            socket.emit("sendMsg", { crewId: crewId, msg: msgInput, dm: dm2 })
            setMsgInput("");
        }
    }

    const joinTheChat = () => {
        initSocketConnect();
        socket.emit("entry", {crewId: newCrewInput});
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
                <select value={dm2} onChange={(e) => setDm2(e.target.value)}>
                    <option value="all">전체</option>
                    {crewListOptions}
                </select>
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