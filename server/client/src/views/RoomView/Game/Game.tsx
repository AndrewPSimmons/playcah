import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'
import { playerType, stateType } from '../../../types'
import BlackCardDisplay from './BlackCardDisplay'
import GameButtons from './GameButtons'
import HandDisplay from './HandDisplay'
import SubmittedCardsDisplay from './SubmittedCardsDisplay'

type GamePropType = {
  classes?: string,
  socket: Socket
}
export default function Game({ classes, socket }: GamePropType) {
  const state = useSelector((store: stateType) => store)
  useEffect(() => {
    console.log("Hello new load in gameee", socket);
    socket.emit("enteringGame", state.room.gameID)
  }, [])
  return (
    <div className='h-full flex flex-col'>
      <div className='h-[50%] flex'>
        <SubmittedCardsDisplay classes="w-[80%]" socket={socket} />
        <BlackCardDisplay classes="w-[20%]" />
      </div>
      {state.game.players && state.game.players.map((player: playerType) => player._id).includes(state.user._id)
        ? <div className='h-[50%] overflow-scroll'>
          <HandDisplay socket={socket} />
        </div>
        : "join"}
    </div>
  )
}
