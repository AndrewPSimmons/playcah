import React from 'react'
import { useSelector } from 'react-redux';
import { stateType } from '../../../types';
import RoomCode from './RoomCode';
import CloseRoom from './CloseRoom';
import InviteLink from './InviteLink';
import LeaveRoom from './LeaveRoom';
import StartGame from './StartGame';

export default function RoomButtons({ socket }: any) {
    const state: stateType = useSelector((store: stateType) => store)
    return (
        <div id='roomButtons' className='flex items-center space-x-2 h-full overflow-hidden'>
            {state.user.isHost ? <CloseRoom socket={socket} /> : <LeaveRoom socket={socket} />}
            <InviteLink />
            <RoomCode/>
            <button onClick={()=>console.log(state)}>CLG State</button>
        </div>
    )
}
