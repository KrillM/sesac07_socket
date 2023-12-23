import { useState, useEffect, useCallback, useMemo } from 'react';
import io from 'socket.io-client';
import Chatting from "./Chatting";
import Notice from "./Notice";

const socket = io.connect("http://localhost:8000", {autoConnect: false});

export default function TalkTogether () {
    const [message, setMessage] = useState(''); // 채팅으로 보낼 메시지
    const [chatting, setChatting] = useState([]); // 채팅 내용

    const [newCrew, setNewCrew] = useState(""); // 새 맴버 추가
    const [crewName, setCrewName] = useState(null); // 맴버의 이름

    const [crewList, setCrewList] = useState({});   // 맴버의 리스트
    const [dm2, setDm2] = useState("all");  // 메시지 보내는 기능

    // 소켓 연결
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
        const talk = `${res.dm ? '(너에게만)' : ''} ${res.message}`
        const newChatting = [...chatting, {type: type, talk: talk, crewName: res.crewName}]
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
        <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js" crossorigin></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous"/>

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
                <input type="text" class="form-control" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button class="btn btn-light" onClick={sendMessage}>전송</button>
            </div>
        </>) : (
            <div className='helloGuys'>
                <h1 className='show-Title'> Talk Together </h1>
                <div className='show-chatting-rooms'>
                    <input type='text' class="form-control" value={newCrew} onChange={(e) => setNewCrew(e.target.value)}/>
                    <button class="btn btn-outline-success" onClick={joinChattingRoom}>입장</button>
                </div>
            </div>
        )}
    </>)
}