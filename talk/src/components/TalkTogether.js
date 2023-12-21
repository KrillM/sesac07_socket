import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chatting from "./Chatting";
import Notice from "./Notice";

const socket = io.connect("http://localhost:8000", {autoConnect: false});

export default function TalkTogether () {
    const [message, setMessage] = useState('');
    const [chatting, setChatting] = useState([
        {
            type: "i",
            talk: 'hello'
        }, {
            type: "you",
            talk: 'hi'
        }, {
            type: "notice",
            talk: '~~~~~~~님이 입장하였습니다.'
        }, 
    ]);

    function initConnectSocket () {
        if(!socket.connected) socket.connect();
    }
    
    useEffect(() => {
        initConnectSocket();
        socket.on("notice", (res) => {
            const newChatting = [...chatting, {type: "notice", talk: res.message}]
            setChatting(newChatting);
        })
    }, [])

    function sendMessage () {}

    return(<>
        <div className='chat-container'>
            {chatting.map((chatting, i) => {
                if(chatting.type === "notice") return <Notice key={i} chatting={chatting}/>
                else return <Chatting key={i} chatting={chatting} />
            })}
        </div>

        <div className="input-container">
            <input type="text" value={message} onClick={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>전송</button>
        </div>
    </>)
}