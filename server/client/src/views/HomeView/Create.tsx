
import axios from "axios"
import React, { useEffect, useState } from "react"
import { userInit } from "../../redux/actions/userActions"
import { useDispatch } from "react-redux"
import * as actionTypes from "../../redux/actionTypes"
import { roomInit } from "../../redux/actions/roomActions"
import { useNavigate } from "react-router-dom"

const validateUsername = (username: string) => {
    let error = {
        error: false,
        messages: [""]
    }
    if(username.length == 0){
        error.error = true
        error.messages.push("Username Empty")
    }
    if (username.length >= 19) {
        error.error = true
        error.messages.push("Username must be 18 or less characters")
    }
    return error
}


export default function Create() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [creating, setCreating] = useState(false)
    const [username, set_username] = useState("")
    const [password, set_password] = useState("")

    const createRoom = async (username: string, password: string) => {
        //Prevent Create Being pressed multiple times
        if (creating) { return }
        setCreating(true)

        //Validate Username
        const usernameErrors = validateUsername(username)
        if (usernameErrors.error) {
            setCreating(false)
            alert(usernameErrors.messages.join("\n"))
            return
        }

        //Send request to createroom
        if (process.env.NODE_ENV == "development") {
            const res = await axios.get("http://localhost:3001/api/createRoom", {
                params: {
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
            //No error means the room was created... we need to do a few things
            const newUser = res.data.data.newUser
            const newRoom = res.data.data.newRoom
            dispatch(userInit(newUser._id, newUser.username))
            dispatch(roomInit(newRoom._id))
            navigate("/room", {replace: true})
        }
    }


    return (
        <div id="create" className="flex flex-col">
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
                <input autoComplete="off" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" onChange={(e) => set_password(e.target.value)} placeholder="optional" />
            </div>

            <button className={(creating ? "bg-green-600" : "bg-green-500 ") + " hover:bg-green-600 text-white font-bold py-2 px-4 rounded"} disabled={creating} onClick={() => createRoom(username, password)}>
                Create Room
            </button>
        </div>
    )
    // return (
    //     <React.Fragment>
    //     <div className="choice-container">
    //         <label htmlFor="username">Username</label>
    //         <input name="username" type="text" onChange={(e)=>set_username(e.target.value)} autoComplete="off"></input>
    //         <label htmlFor="password">Password</label>
    //         <sub>Leave blank if no password</sub>
    //         <input name="password" type="text" onChange={(e)=>set_password(e.target.value)} autoComplete="off"></input>
    //         <button onClick={() => console.log("creating room")}>Create</button>
    //     </div>
    //     </React.Fragment>
    // )
}