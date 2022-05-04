import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { PackWithCardsType } from '../../../../../src/types'
import { stateType } from '../../../types'

export default function PackSelectionItem({ idx, pack, socket }: any) {
  const inputRef:any = useRef(null)
  const state:stateType = useSelector((store: stateType) => store)
  const [checkStatus, setCheckStatus] = useState(false)
  useEffect(()=> {
    if(state.room.packs.map((statePack: PackWithCardsType)=> statePack.pack_id).includes(pack.pack_id)){
      setCheckStatus(true)
    }
  }, [])
  const boxChecked = () => {
    if(inputRef.current == null){
      console.log("input ref is null in PackselectionItem");
      return
    }
    const newVal = !checkStatus
    setCheckStatus(newVal)
    inputRef.current.checked = newVal
    const dataPayload = {
      retain: newVal,
      ...pack
    }
    console.log("dataPayload", dataPayload);
    socket.emit("updatingPacks", dataPayload)
  }

  useEffect(()=> {

  }, [checkStatus])
  //onClick={() => { boxChecked() }}
  return (
    <div className='text-xs' key={idx} onClick={()=> {boxChecked()}}>
      <input type="checkbox" ref={inputRef} name={`${idx}-pack`} id={`${idx}-pack`} defaultChecked={checkStatus}  />
      {pack.name} - {pack.card_count}
    </div>
  )
}
