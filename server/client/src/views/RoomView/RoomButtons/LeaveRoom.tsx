import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { stateType } from '../../../types'
import { Socket } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { userSetNull } from '../../../redux/actions/userActions'
import { roomSetNull } from '../../../redux/actions/roomActions'


type PropType = {
    socket: Socket
}
export default function LeaveRoom({ socket }: PropType) {
    const state: stateType = useSelector((state: stateType) => state)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const leaveRoomFunction = () => {
        console.log("leaving room emit");
        socket.emit("leavingRoom")
    }
    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={leaveRoomFunction}>Leave Room</button>
        </div>)
}
