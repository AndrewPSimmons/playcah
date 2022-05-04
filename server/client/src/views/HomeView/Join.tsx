import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { userInit, userNewId } from "../../redux/actions/userActions"
import axios from "axios"
import { roomInit } from "../../redux/actions/roomActions"
import { useNavigate } from "react-router-dom"
const validateUsername = (username: string) => {
    let error = {
        error: false,
        messages: [""]
    }
    if(username.length == 0){
        error.error = true
        error.messages.push("Username Empty")
    }
    if (username.length >= 19) {
        error.error = true
        error.messages.push("Username must be 18 or less characters")
    }
    return error
}
const validateRoomCode = (roomCode: string) => {
    let error = {
        error: false,
        messages: [""]
    }
    if(roomCode.length == 0){
        error.error = true
        error.messages.push("Room Code Empty")
    }
    return error
}


export default function Join() {
    const [creating, setCreating] = useState(false)
    const [username, set_username] = useState("")
    const [roomCode, set_roomCode] = useState("")
    const [password, set_password] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const joinRoom = async (roomCode: string, username: string, password: string) => {
        setCreating(true)
        const roomCodeErrors = validateRoomCode(roomCode)
        const usernameErrors = validateUsername(username)
        if(roomCodeErrors.error){
            alert(roomCodeErrors.messages.join("\n"))
            setCreating(false)
            return
        }
        if (usernameErrors.error) {
            alert(usernameErrors.messages.join("\n"))
            setCreating(false)
            return
        }

        if (process.env.NODE_ENV == "development") {
            const res = await axios.get("http://localhost:3001/api/joinRoom", {
                params: {
                    roomCode,
                    username: username,
                    password: password
                }
            })
            console.log(res.data);
            if (res.data.error) {
                setCreating(false)
                alert(res.data.message)
                return
            }
            console.log(res);
            //No error means the room was created... we need to do a few things
            const newUser = res.data.data.newUser
            const room = res.data.data.room
            dispatch(userInit(newUser._id, newUser.username, false, res.data.data.roomCode))
            //dispatch(roomInit(room._id, room.members))
            
            navigate("/room", {replace: true})  
            // navigate("/room", {replace: true})  
        }
        console.log(roomCode, username, password);
        
    }
    return (
        <div id="join" className="flex flex-col">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomCode">
                    Room Code
                </label>
                <input autoComplete="off" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="roomCode" type="text" onChange={(e) => set_roomCode(e.target.value)} placeholder="required"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input autoComplete="off" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" onChange={(e) => set_username(e.target.value)}placeholder="required" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input autoComplete="off" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" onChange={(e) => set_password(e.target.value)} placeholder="optional"/>
            </div>

            <button className={(creating ? "bg-green-600" : "bg-green-500 ") + " hover:bg-green-600 text-white font-bold py-2 px-4 rounded"} disabled={creating} onClick={() => joinRoom(roomCode, username, password)}>
                Join Room
            </button>
        </div>
    )
    return (
        <React.Fragment>
            <div className="choice-container">
                <label htmlFor="username">Username</label>
                <input name="username" type="text" onChange={(e) => set_username(e.target.value)} autoComplete="off"></input>
                <label htmlFor="roomcode">Room Code</label>
                <input name="roomcode" type="text" onChange={(e) => set_roomCode(e.target.value)} autoComplete="off"></input>
                <label htmlFor="password">Password</label>
                <sub>Leave blank if no password</sub>
                <input name="password" type="text" onChange={(e) => set_password(e.target.value)} autoComplete="off"></input>
                <button onClick={() => joinRoom(username, roomCode, password)}>Join</button>
            </div>
        </React.Fragment>
    )
}