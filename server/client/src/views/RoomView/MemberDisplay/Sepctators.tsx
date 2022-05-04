import React from 'react'
import { useSelector } from 'react-redux'
import { memberType, playerType, stateType } from '../../../types'

export default function Sepctators() {
  const state = useSelector((state: stateType) => state)

  return (
    <div>
      {
        state.room.members.map((roomMember: memberType) => {
          if(state.game.players?.map((player: playerType)=>player._id).includes(roomMember._id)){return null}
          return <p>{roomMember.username}</p>
        })
        // state.room.members.filter((roomMember: memberType) => {
        //   if(!state.game.players)return
        //   return state.game.players.map((player: playerType)=> {
        //     return player._id
        //   }).includes(roomMember._id)
        // })
      }
    </div>
  )
}
