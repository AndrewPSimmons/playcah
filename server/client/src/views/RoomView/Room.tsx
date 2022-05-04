import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import LoadingScreen from '../../components/reuse/LoadingScreen'
import CreateSocketFunction from '../../functions/CreateSocketFunction'
import { roomSetNull } from '../../redux/actions/roomActions'
import { userSetNull } from '../../redux/actions/userActions'
import { stateType } from '../../types'
import ChatBox from './ChatBox'
import Game from './Game'
import GameButtons from './Game/GameButtons'
import GameSettings from './GameSettings'
import MemberDisplay from './MemberDisplay'
import PackSelection from './PackSelection'
import RoomButtons from './RoomButtons'
import StartGame from './RoomButtons/StartGame'
import RoomSettings from './RoomSettings'


export default function RoomView() {
  const [socket, setSocket] = useState<Socket | null | undefined>(undefined)
  const state: stateType = useSelector((state: stateType) => state)
  const roomState = useSelector((state: stateType) => state.room)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //Socket init effect
  useEffect(() => {
    async function validateSocket(userId: string) {
      const userCheck = await axios.get("http://localhost:3001/api/validUser", { params: { id: userId } })
      if (!userCheck.data) {
        setSocket(null)
        return
      }
      const s = CreateSocketFunction(state.user._id, state.user.roomCode)
      setSocket(s)
    }
    validateSocket(state.user._id)

    socket?.emit("getRoomData")
    // return () => {
    //   socket?.emit("doDisconnect")
    //   setSocket(undefined)
    //   console.log("unmounting room comp");
    // }
  }, [])
  if (socket === undefined) {
    return <LoadingScreen />
  }
  if (socket === null) {
    console.log("doing redirect 2", socket);
    navigate("/", {replace: true})
    return <div>
      <Navigate to={"/"} />
      <LoadingScreen />
    </div>
  }


  return (
    <div className='flex flex-col bg-orange-50 p-2 h-screen justify-between overflow-x-scroll'>
      <div className='h-[3%] flex'>
        <RoomButtons classes="" socket={socket} />  {state.room.inGame ? <GameButtons socket={socket}/> : null} 
      </div>
      {/* {JSON.stringify(state)} */}
      {state.room.inGame 
      ? socket && <Game classes="" socket={socket}/>
      : <div className='h-[72%] flex justify-between'>
        {/* <Game /> */}
        <PackSelection socket={socket}/>
        {state.room.gameSettings && <GameSettings socket={socket}/>}
        {state.room.roomSettings && <RoomSettings socket={socket}/>}

      </div>
       }
      <div className='flex justify-between h-[25%]'>
        <MemberDisplay classes="" />
        {!state.room.inGame && state.user.isHost && <StartGame socket={socket}/>}
        <ChatBox classes="" socket={socket} />
      </div>
    </div>
  )
}
