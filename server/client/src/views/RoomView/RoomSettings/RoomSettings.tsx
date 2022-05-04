import React, { useEffect, useReducer, useRef } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../types'
import RoomSettingsDisplayItem from './RoomSettingsDisplayItem'

const settingsReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'muteNonPlayers':
      return { ...state, muteNonPlayers: action.payload }
    default:
      return state
  }
}


export default function RoomSettings({socket}: any) {
  const state: stateType = useSelector((store: stateType) => store)
  const muteNonPlayersEl = useRef(null)
  const isMounted = useRef(false);

  const [settings, dispatchSettings] = useReducer(settingsReducer, state.room.roomSettings)

  useEffect(() => {
    if (isMounted.current) {
      console.log("changing");
      socket.emit("updatingRoomSettings", settings)
    } else {
      isMounted.current = true;
    }
  }, [settings])
  if (settings == null) {
    return <p>Settings null</p>
  }
  return (
  <div className='w-1/3 overflow-hidden h-auto p-1 m-2 rounded-lg shadow-lg'>
      <div className='flex items-center justify-center'>
        Room Settings
      </div>
      {!state.user.isHost ?
        <div>
          {state.room.roomSettings && Object.entries(state.room.roomSettings).map((el, key) => {
            return <RoomSettingsDisplayItem entry={el}/>
          })}
        </div>
        :
        <div className='px-4'>
           <div>
            <label htmlFor="muteNonPlayers">Mute Non Players</label>
            <input
              disabled={!state.user.isHost}
              type="checkbox"
              name="useBlankCards"
              defaultChecked={state.room.roomSettings && state.room.roomSettings.muteNonPlayers}
              onChange={(e) => dispatchSettings({ type: "muteNonPlayers", payload: e.target.checked })} />
          </div>
        </div>}
    </div >
  )
}
