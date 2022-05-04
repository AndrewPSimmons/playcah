import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { playerType, stateType } from '../../../types'

export default function Players() {
  const state = useSelector((state: stateType) => state)
  const [players, setPlayers] = useState(state.game.players)
  return (
    <div>
      {state.game.players?.map((player: playerType)=> {
        return <div className='flex' key={player._id}>
        <p>{player.username}</p>
        {player.is_host && <p className=''>(h)</p>}
        <p className='px-2'> {player.score}</p>
        {state.game.judgeId == player._id && <p>[JUDGE]</p>}
      </div>
      })}
    </div>
  )
}
