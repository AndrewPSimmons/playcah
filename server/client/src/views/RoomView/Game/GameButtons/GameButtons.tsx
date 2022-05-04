import React from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../../types'
import EndGame from './EndGame'

export default function GameButtons({socket}: any) {
  const state: stateType = useSelector((store :stateType) => store)
  return (
    <div className='flex items-center overflow-hidden'>
      {state.user.isHost && <EndGame socket={socket}/>}
    </div>
  )
}
