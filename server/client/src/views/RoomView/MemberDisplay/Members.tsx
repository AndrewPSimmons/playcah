import React from 'react'
import { useSelector } from 'react-redux'
import { memberType, stateType } from '../../../types'

export default function Members() {
  const state = useSelector((state: stateType) => state)

  return (
    <div>
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
