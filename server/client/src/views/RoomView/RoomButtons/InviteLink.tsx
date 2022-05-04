import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../types'
export default function InviteLink() {
    const [hide, setHide] = useState(false)
    const state: stateType = useSelector((state: stateType) => state)
    return (
        <div className=''>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => {
                navigator.clipboard.writeText(`http://localhost:3000/room/${state.user._id}`)
            }}>Invite Link</button>

        </div>
    )
}
