import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { stateType } from '../types'
import { io, Socket } from 'socket.io-client'
import store from '../redux/configure-store'
import { roomSetNull } from '../redux/actions/roomActions'
import { userSetNull } from '../redux/actions/userActions'
import { roomNewData } from '../redux/actions/roomActions'


// function useSocket(userId: string, roomCode: string) {
//     const state: stateType = store.getState()
//     const dispatch = useDispatch()

//     const s = io("http://localhost:3002", {
//         query: {
//             userId,
//             roomCode
//         }
//     })
//     s.on("roomData", data => {
//         const newData = {
//             roomCode: data._id,
//             members: data.members
//         }
//         console.log("new dataL :,", data)
//         dispatch(roomNewData(newData))
//     })
//     s.on("roomClosed", data => {
//         console.log("message recieved to leave because room is closed")
//         store.dispatch(roomSetNull())
//         store.dispatch(userSetNull())
//         window.location.href = "/"
//     })
//     //Left off trying to get the socket to emit "getRoomData" on connection
//     s.on("connect", (data: void) => {
//         console.log("connected socket")

//     })
//     s.on("disconnect", data => {
//         console.log("Socket Disconnected")
//     })
//     s.on("test", data => {
//         console.log("test in client", data)
//     })

//     return s
// }
export default {}
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
//         const res = await axios.get("http://localhost:3001/api/validUser", { params: { id } })
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
