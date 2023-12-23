import { useState, useEffect, useCallback, useMemo, useDebugValue } from 'react';
import io from 'socket.io-client';
import Chatting from "./Chatting";
import Notice from "./Notice";

const socket = io.connect("http://localhost:8000", {autoConnect: false});

export default function TalkTogether () {
    const [message, setMessage] = useState('');
    const [chatting, setChatting] = useState([]);

    const [newCrew, setNewCrew] = useState("");
    const [crewName, setCrewName] = useState(null);

    const [crewList, setCrewList] = useState({});
    const [dm2, setDm2] = useState("all");

    function initConnectSocket () {
        if(!socket.connected) socket.connect();
    }
    
    useEffect(() => {
        socket.on("error", (res) => {
            alert(res.message)
        })

        socket.on("entried", (res) => {
            setCrewName(res.crewName);
        })

        socket.on("crewList", (res) => {
            setCrewList(res);
        })
    }, [])

    const crewListOption = useMemo(() => {
        const option = []
        for(const key in crewList){
            if(crewList[key] === crewName) continue;
            option.push(<option key={key} value={key}>{crewList[key]}</option>)
        }
        return option
    }, [crewList])

    const addChatting = useCallback((res) => {
        const type = res.crewName === crewName ? "i" : "you";
        const talk = `${res.dm ? '(너에게만)' : ''} ${res.crewName}: ${res.message}`
        const newChatting = [...chatting, {type: type, talk: talk}]
        setChatting(newChatting);
    }, [crewName, chatting])

    useEffect(() => {
        socket.on("chat", addChatting);
        return () => socket.off("chat", addChatting)
    },[addChatting])

    socket.on("chat", addChatting)
 
    useEffect(() => {
        const notice = (res) => {
            const newChatting = [...chatting, {type: "notice", talk: res.message}]
            setChatting(newChatting);
        }

        socket.on("notice", notice);
        return () => socket.off("notice", notice);
    }, [chatting])

    function sendMessage () {
        if(message !== ""){
            socket.emit("sendMessage", {crewName: crewName, message: message, dm: dm2})
            setMessage("")
        }
    }

    function joinChattingRoom () {
        initConnectSocket();
        socket.emit("entry", {crewName: newCrew});
    }

    return(<>
        { crewName ? (<>
            <div className='chat-container'>
                {chatting.map((chatting, i) => {
                    if(chatting.type === "notice") return <Notice key={i} chatting={chatting}/>
                    else return <Chatting key={i} chatting={chatting} />
                })}
            </div>

            <div className="input-container">
                <select value={dm2} onChange={(e) => setDm2(e.target.value)}>
                    <option value="all">모두에게</option>
                    {crewListOption}
                </select>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>전송</button>
            </div>
        </>) : (<>
            <div className='input-container'>
                <input type='text' value={newCrew} onChange={(e) => setNewCrew(e.target.value)}/>
                <button onClick={joinChattingRoom}>채팅방 입장</button>
            </div>
        </>) }
    </>)
}