import React from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import { stateType } from '../../../../types'

type PropType = {
    socket: Socket
}
export default function EndGame({ socket }: PropType) {
    const state: stateType = useSelector((state: stateType) => state)


    const closeRoomFunction = () => {
        socket.emit("endingGame", state.game._id)
    }
    return (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeRoomFunction}>End Game</button>
        )
}


