export default function Chatting( {chatting} ) {
    return <div className={`list ${chatting.type}-chat`}>
        <div className="content">{chatting.talk}</div>
    </div>
}