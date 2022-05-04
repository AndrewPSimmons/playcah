import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { memberType, stateType } from '../../../types'
import Members from './Members'
import Players from './Players'
import Sepctators from './Sepctators'

type MembersDisplayPropsType = {
  classes?: string
}
export default function MemberDisplay({ classes }: MembersDisplayPropsType) {
  const state = useSelector((state: stateType) => state)
  const [display, setDisplay] = useState("players")
  return (
    <div className={"border-2 border-black p-1 h-full w-full overflow-auto" + " " + classes}>
      {!state.room.inGame ? <Members /> :
        <div>
          <div className='w-fit'>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="mr-1">
                <a 
                onClick={() => setDisplay("players")} 
                className={display == "players" ? "inline-block p-1 text-blue-600 bg-gray-100 rounded-t-lg active " : "inline-block p-1 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "}
                >Players</a>
              </li>
              <li className="mr-1">
                <a 
                onClick={() => setDisplay("spectators")} 
                className={display == "spectators" ? "inline-block p-1 text-blue-600 bg-gray-100 rounded-t-lg active " : "inline-block p-1 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "}
                >Spectators</a>
              </li>
            </ul>
          </div>
          {display == "players" ? <Players/> : <Sepctators/>}
        </div>}
    </div>
  )
  return (
    <div className={"border-2 border-black p-1 h-full overflow-auto" + " " + classes}>
      <div className='w-full flex'>
        <p>Players</p>
        <p>Spectators</p>
      </div>
      {<div className=''>
        {state.room.members && state.room.members.map((member: memberType) => {
          return <div className='flex' key={member._id}>
            <p>{member.username}</p>
            {member.is_host && <p className='px-1'>(host)</p>}
          </div>
        })}
      </div>}
    </div>
  )
}
