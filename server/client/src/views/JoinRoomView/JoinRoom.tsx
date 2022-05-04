import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { roomInit } from '../../redux/actions/roomActions'
import { userInit } from '../../redux/actions/userActions'
import { useLocation } from 'react-router-dom'
import LoadingScreen from '../../components/reuse/LoadingScreen'
const validateUsername = (username: string) => {
  let error = {
    error: false,
    messages: [""]
  }
  if (username.length == 0) {
    error.error = true
    error.messages.push("Username Empty")
  }
  if (username.length >= 19) {
    error.error = true
    error.messages.push("Username must be 18 or less characters")
  }
  return error
}
const validateRoomCode = (roomCode: string) => {
  let error = {
    error: false,
    messages: [""]
  }
  if (roomCode.length == 0) {
    error.error = true
    error.messages.push("Room Code Empty")
  }
  return error
}
export default function JoinRoomView() {
  const [creating, setCreating] = useState(false)
  const [username, set_username] = useState("")
  const [password, set_password] = useState("")
  const [shouldHide, setShouldHide] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [roomCode, setRoomCode] = useState<string | null | undefined>(undefined)
  useEffect(() => {
    async function getRoomCode() {
      const locationSplit = location.pathname.split("/")
      const [userIdToJoin] = locationSplit.slice(-1)
      let urlBase = ""
      if (process.env.NODE_ENV == "development") {
        urlBase = "localhost:3001"
      } else {
        urlBase = "playcah.com"
      }
      const res = await axios.get("http://" + urlBase + "/api/roomCodeFromUser", {
        params: { userId: userIdToJoin }
      })
      console.log(res.data);
      if (res.data === null) {
        setRoomCode(null)
        return
      }
      setRoomCode(res.data)
    }
    getRoomCode()
  }, [])

  const joinRoom = async (roomCode: string, username: string, password: string) => {
    setCreating(true)
    const roomCodeErrors = validateRoomCode(roomCode)
    const usernameErrors = validateUsername(username)
    if (roomCodeErrors.error) {
      alert(roomCodeErrors.messages.join("\n"))
      setCreating(false)
      return
    }
    if (usernameErrors.error) {
      alert(usernameErrors.messages.join("\n"))
      setCreating(false)
      return
    }

    if (process.env.NODE_ENV == "development") {
      let urlBase = ""
      if (process.env.NODE_ENV == "development") {
        urlBase = "localhost:3001"
      } else {
        urlBase = "playcah.com"
      }
      const res = await axios.get("http://" + urlBase + "/api/joinRoom", {
        params: {
          roomCode,
          username: username,
          password: password
        }
      })
      console.log(res.data);
      if (res.data.error) {
        setCreating(false)
        alert(res.data.message)
        return
      }
      console.log(res);
      //No error means the room was created... we need to do a few things
      const newUser = res.data.data.newUser
      const room = res.data.data.room
      dispatch(userInit(newUser._id, newUser.username, false, res.data.data.roomCode))
      //dispatch(roomInit(room._id, room.members))

      navigate("/room", { replace: true })
      // navigate("/room", {replace: true})  
    }
    console.log(roomCode, username, password);

  }
  if (roomCode === undefined) {
    return <LoadingScreen />
  }
  if (roomCode === null) {
    return <div>Bad Invite Link</div>
  }
  return (
    <div className='flex items-center justify-center'>
      <div id="join" className="flex flex-col items-center">

        <div onClick={() => setShouldHide(!shouldHide)} onMouseOut={() => setShouldHide(true)} className="px-5">
          <h1 className='text-3xl pt-12 pb-4'>Room: {shouldHide ? 'Click to Show' : roomCode}</h1>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input autoComplete="off" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" onChange={(e) => set_username(e.target.value)} placeholder="required" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input autoComplete="off" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" onChange={(e) => set_password(e.target.value)} placeholder="optional" />
        </div>

        <button className={(creating ? "bg-green-600" : "bg-green-500 ") + " hover:bg-green-600 text-white font-bold py-2 px-4 rounded"} disabled={creating} onClick={() => joinRoom(roomCode, username, password)}>
          Join Room
        </button>
      </div>
    </div>
  )
}
