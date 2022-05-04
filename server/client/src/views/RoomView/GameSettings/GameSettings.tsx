import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../types'
import GameSettingsDisplayItem from './GameSettingsDisplayItem'

const settingsReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'handLimit':
      return { ...state, handLimit: action.payload }
    case 'useBlankCards':
      return { ...state, useBlankCards: action.payload }
    case 'blankCardCount':
      return { ...state, blankCardCount: action.payload }
    case 'victoryLimit':
      return { ...state, victoryLimit: action.payload }
    case 'blackCardOnlyPickOne':
      return { ...state, blackCardOnlyPickOne: action.payload }
    default:
      return state
  }
}

export default function GameSettings({ socket }: any) {
  const state: stateType = useSelector((store: stateType) => store)
  const [settings, dispatchSettings] = useReducer(settingsReducer, state.room.gameSettings)

  const isMounted = useRef(false);
  const handLimitEl: null | any = useRef(null)
  const blankCardCountEl: null | any = useRef(null)
  const victoryLimitEl: null | any = useRef(null)
  const handLimitValidator = (value: string) => {
    if (handLimitEl.current == null) {
      return
    }
    if (Number(value) > 20) {
      handLimitEl.current.value = 20
      value = '20'
    }
    if (Number(value) < 6) {
      handLimitEl.current.value = 6
      value = '6'
    }
    dispatchSettings({ type: "handLimit", payload: Number(value) })
  }

  const blankCardCountValidator = (value: string) => {
    const max = 99
    const min = 1
    if (blankCardCountEl.current == null) {
      return
    }
    if (Number(value) > max) {
      blankCardCountEl.current.value = max
      value = `${max}`
    }
    if (Number(value) < min) {
      blankCardCountEl.current.value = min
      value = `${min}`
    }
    dispatchSettings({ type: "blankCardCount", payload: Number(value) })
  }

  const victoryLimitValidator = (value: string) => {
    const max = 99
    const min = 5
    if (victoryLimitEl.current == null) {
      return
    }
    if (Number(value) > max) {
      victoryLimitEl.current.value = max
      value = `${max}`
    }
    if (Number(value) < min) {
      victoryLimitEl.current.value = min
      value = `${min}`
    }
    dispatchSettings({ type: "victoryLimit", payload: Number(value) })
  }
  useEffect(() => {
    if (isMounted.current) {
      console.log("changing");
      socket.emit("updatingGameSettings", settings)
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
        Game Settings
      </div>
      {!state.user.isHost ?
        <div>
          {state.room.gameSettings && Object.entries(state.room.gameSettings).map((el, key) => {
            return <GameSettingsDisplayItem entry={el}/>
          })}
        </div>
        :
        <div className='px-4'>
          <div>
            <label className='pr-2' htmlFor="handLimit">Hand Limit</label>
            <input
              disabled={!state.user.isHost}
              type="number"
              ref={handLimitEl}
              min={6}
              max={20}
              name='handLimit'
              onKeyDown={(e) => { if (e.key == "Enter") handLimitEl.current && handLimitEl.current.blur() }}
              onBlur={(e) => { handLimitValidator(e.target.value) }} defaultValue={state.room.gameSettings && state.room.gameSettings.handLimit} />
          </div>

          <div>
            <label htmlFor="useBlankCards">Use Blank Cards</label>
            <input
              disabled={!state.user.isHost}
              type="checkbox"
              name="useBlankCards"
              defaultChecked={state.room.gameSettings && state.room.gameSettings.useBlankCards}
              onChange={(e) => dispatchSettings({ type: "useBlankCards", payload: e.target.checked })} />
          </div>

          <div>
            <label className='pr-2' htmlFor="blankCardCount">Blank Card Count</label>
            <input
              disabled={!state.user.isHost || !settings.useBlankCards}
              type="number"
              ref={blankCardCountEl}
              min={1}
              max={99}
              name='blankCardCount'
              onKeyDown={(e) => { if (e.key == "Enter") blankCardCountEl.current && blankCardCountEl.current.blur() }}
              onBlur={(e) => { blankCardCountValidator(e.target.value) }} defaultValue={state.room.gameSettings && state.room.gameSettings.blankCardCount} />
          </div>

          <div>
            <label className='pr-2' htmlFor="victoryLimit">Victory Limit</label>
            <input
              disabled={!state.user.isHost}
              type="number"
              ref={victoryLimitEl}
              min={1}
              max={99}
              name='victoryLimit'
              onKeyDown={(e) => { if (e.key == "Enter") victoryLimitEl.current && victoryLimitEl.current.blur() }}
              onBlur={(e) => { victoryLimitValidator(e.target.value) }} defaultValue={state.room.gameSettings && state.room.gameSettings.victoryLimit} />
          </div>

          <div>
            <label htmlFor="blackCardOnlyPickOne">Black Card 1 blank</label>
            <input
              disabled={!state.user.isHost}
              type="checkbox"
              name="blackCardOnlyPickOne"
              defaultChecked={state.room.gameSettings && state.room.gameSettings.blackCardOnlyPickOne}

              onChange={(e) => dispatchSettings({ type: "blackCardOnlyPickOne", payload: e.target.checked })} />
          </div>
        </div>}

      {/* {Object.keys(settings).map(element => {
        return <p>{element} - {JSON.stringify(settings[element])}</p>
      })}

      {state.room.gameSettings && Object.entries(state.room.gameSettings).map((el, key) => {
        return <p>{JSON.stringify(el)}</p>
      })}  */}
    </div >
  )
}
