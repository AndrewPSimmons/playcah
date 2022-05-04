import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../types'

export default function ChatBox({ socket }: any) {
    const [messages, setMessages] = useState([{ message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }, { message: "hello", username: "andrew" }])
    const [messageInput, setMessageInput] = useState("")
    const messageInputRef = useRef<HTMLInputElement | null>(null)

    const state: stateType = useSelector((store: stateType) => store)

    const sendMessage = () => {
        if(messageInput.length == 0 )return
        if (messageInputRef.current) messageInputRef.current.value = ""
        const dataPayload = {
            message: messageInput,
            username: state.user.username
        }
        socket.emit("sendingMessage", dataPayload)

        setMessageInput("")
    }
    const newMessageInput = (text: string) => {
        setMessageInput(text)
    }
    useEffect(() => {
    }, [])
    return (
        <div className='w-full'>
            <div className="flex h-full flex-col justify-around items-center">
                <div className="w-full flex flex-col h-full m-0 border-2 border-black border-r-4 overflow-hidden">
                    <div className="border-2 relative h-full overflow-auto rotate-180 flex-row-reverse pl-20">
                        {state.chat.messages.slice(0).reverse().map((message, index) => {
                            return <div className="rotate-180 pl-3" key={index}>{message.username} - {message.message}</div>
                        })}
                    </div>
                    <div className="border-t-2 border-black flex justify-center items-center">
                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="w-full border-none p-1">
                            <input className="borer-none w-full text-xs p-1 focus:outline-none bg-transparent" placeholder="message" id="message_input" ref={messageInputRef} type="text" onChange={(e) => newMessageInput(e.target.value)} autoComplete="off"></input>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}
