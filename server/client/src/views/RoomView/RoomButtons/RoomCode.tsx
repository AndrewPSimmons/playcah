import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../types'

export default function RoomCode() {
    const [show, setShow] = useState(false)
    const roomCode = useSelector((store: stateType) => store.room.roomCode)
  return (
    <div className='pr-3' onClick={()=>setShow(true)} onMouseOut={()=>setShow(false)}>
        RoomCode: {show ? roomCode : "Click"}
    </div>
  )
}
