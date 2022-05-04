import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { messageType, stateType } from '../types'
import { io, Socket } from 'socket.io-client'
import store from '../redux/configure-store'
import { roomSetNull } from '../redux/actions/roomActions'
import { userSetNull } from '../redux/actions/userActions'
import { roomNewData } from '../redux/actions/roomActions'
import { chatSetNull, newMessage } from '../redux/actions/chatActions'
import { setNull } from '../redux/actions'
import { gameNewData, gameSetNull } from '../redux/actions/gameActions'

const state: stateType = store.getState()
const CreateSocket = (userId: string, roomCode: string) => {
    let urlBase = process.env.NODE_ENV == "development" ? "locahost:3002" : "playcah.com"
    const s = io("http://"+urlBase+":3002", {
        query: {
            userId,
            roomCode
        }
    })
    s.on("roomData", data => {
        console.log("room data:", data)
        const newData = {
            roomCode: data._id,
            members: data.members,
            inGame: data.inGame,
            gameID: data.gameID,
            packs: data.packs,
            gameSettings: data.gameSettings,
            roomSettings: data.roomSettings
        }
        console.log("new data :,", newData)
        store.dispatch(roomNewData({...newData}))
    })
    s.on("roomLeft", data=> {
        console.log("message recieved to leave because member wanted to")
        store.dispatch(setNull())
        window.location.href = "/"
    })
    s.on("roomClosed", data => {
        console.log("message recieved to leave because room is closed")
        store.dispatch(setNull())
        window.location.href = "/"

    })
    //Left off trying to get the socket to emit "getRoomData" on connection
    s.on("connect", (data: void) => {
        console.log("connected socket")
        
    })
    s.on("disconnect", data => {
        console.log("Socket Disconnected")
    })
    s.on("test", data=> {
        console.log("test in client", data)
    })

    s.on("newMessage", (data: messageType) => {
        store.dispatch(newMessage(data.message, data.username))
    })

    s.on("gameEntered", data=> {
        console.log("Game enter", data)
        store.dispatch(gameNewData(data))
        //Dispatcg Game Start
    })
    s.on("gameNewData", data=> {
        console.log("new game data", data)
        store.dispatch(gameNewData(data))
    })
    s.on("gameEnded", data=> {
        console.log("Game ended")
        store.dispatch(gameSetNull())
    })
    return s
}
export default CreateSocket
// export default function useSocket() {
//     const [socket, setSocket] = useState<Socket|null>(null)
//     const store: storeType = useSelector((state: storeType) => state)

//     const createSocket = () => {
//         console.log("creating socket");
//         const s = io("http://localhost:3002", {
//             query: {
//                 userId: store.user._id
//             }
//         })
//         s.on("connect", (data: void) => {
//             console.log("connected socket")
//         })
//         s.on("disconnect", data => {
//             console.log("Socket Disconnected")
//         })
//         console.log("socket",s);
//         setSocket(s)
//     }

//     const validUser = async () => {
//         const id = store.user._id
//         const res = await axios.get("http://" + urlBase +"/api/validUser", { params: { id } })
//         return res.data
//     }
//     useEffect(() => {
//         async function validateSocket() {
//             const userIsValid = await validUser()
//             //If we get errors when making the socket... add more checks here
//             if (!userIsValid /* || !otherIsValid ...add more checks if needed*/) {
//                 return
//             }
//             createSocket()
//         }
//         validateSocket()
//     }, [])
//     return socket
// }
