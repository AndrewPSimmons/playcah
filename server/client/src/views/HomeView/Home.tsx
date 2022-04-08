import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Create from './Create'
import Join from './Join'

import BasicButton from '../../components/reuse/BasicButton'
import axios from 'axios'
import LoadingScreen from '../../components/reuse/LoadingScreen'
//Functions
const joinRoom = () => {

}


export default function HomeView() {
  const [checkingRoomCode, setCheckingRoomCode] = useState(true)
  const [buttonChoice, setButtonChoice] = useState("")
  const [hasRoomCode, setHasRoomCode] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    async function checkRoomCode() 
    {
      //If roomCode is set it will make an api call to see if stored room code is valid
      if (sessionStorage.getItem("state")) {
        const state = JSON.parse(sessionStorage.getItem("state") || "{}")
        if (state.room.roomCode && state.room.roomCode !== null) {
          const doRedirect = await axios.get("http://localhost:3001/api/validRoomCode", { params: { roomCode: state.room.roomCode } })
          if (doRedirect) { navigate("/room") }
        }
      }
      setCheckingRoomCode(false)
    }
    checkRoomCode()
  }, [])
  if (checkingRoomCode) {
    return <LoadingScreen/>
  }
  return (
    <div className='flex flex-col items-center justify-center mt-8'>
      {hasRoomCode ? <Navigate replace to="/room" /> : null}
      <div id='homeBox' className='flex flex-col items-center border-4 border-black p-8'>
        <h1 className='text-3xl'>Come Play Cards</h1>
        <div className='flex justify-around w-full py-4'>
          <button className={(buttonChoice == "create" ? "bg-blue-700" : "bg-blue-500 ") + " hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={() => setButtonChoice("create")}>Create</button>
          <button className={(buttonChoice == "join" ? "bg-blue-700" : "bg-blue-500 ") + " hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={() => setButtonChoice("join")}>Join</button>
        </div>

        {buttonChoice == "create" ? <Create /> : null}
        {buttonChoice == "join" ? <Join /> : null}
      </div>
      <div>
      </div>
    </div>
  )
  // return (
  //   <React.Fragment>
  //     <div className="flex items-center justify-center flex-col">
  //       <div className="">
  //         <div className="landing-head">
  //           <h1 className="landing-title">COME PLAY CARDS</h1>
  //         </div>
  //         <div className="landing-body">
  //           <div className="landing-item">
  //             <button className="landing-butt landing-butt-create" onClick={() => set_button_choice("create")}>Create Room</button>
  //           </div>
  //           <div className="landing-item">
  //             <button className="landing-butt landing-butt-join" onClick={() => set_button_choice("join")}>Join Room</button>
  //           </div>
  //         </div>
  //       </div>
  //       {button_choice == "create" ? <Create /> : null}
  //       {button_choice == "join" ? <Join /> : null}
  //     </div>
  //   </React.Fragment>
  // )
}
