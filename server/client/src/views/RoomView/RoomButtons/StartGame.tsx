import React from 'react'
import { useSelector } from 'react-redux'
import { packType, stateType } from '../../../types'

export default function StartGame({ socket }: any) {
    const state:stateType = useSelector((store:stateType)=> store)
    const startGameFunction = () => {
        if(state.room.packs.length == 0){
            alert("no packs selected")
            return
        }
        // if(state.room.members.length < 3){
        //     alert("not enough players")
        //     return
        // }
        const card_total = state.room.packs.reduce((total, cur: packType) => {return total + cur.card_count}, 0)
        if(card_total < state.room.members.length * 40){
            alert("Not enough cards: " + card_total + ", select more packs")
            return
        }
        socket.emit("startingGame", state.room)
        
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-20 rounded" onClick={startGameFunction}>Start Game</button>

    )
}
