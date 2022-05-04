import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../types'
import PackSelectionDisplayItem from './PackSelectionDisplayItem'
import PackSelectionItem from './PackSelectionItem'

export default function PackSelection({ socket }: any) {
  const [packs, setPacks] = useState<any[]>([])
  const [fullPacks, setFullPacks] = useState([])
  const [onlyOfficial, setOnlyOfficial] = useState(false)
  const [searchText, setSearchText] = useState<null | string>(null)
  const [searching, setSearching] = useState(false)

  const state: stateType = useSelector((store: stateType) => store)
  useEffect(() => {
    const asyncEffect = async () => {
      let urlBase = ""
      if (process.env.NODE_ENV == "development") {
        urlBase = "localhost:3001"
      } else {
        urlBase = "playcah.com"
      }
      const packs = await axios.get("http://" + urlBase +"/api/getPackMeta")
      setPacks(packs.data)
      setFullPacks(packs.data)
    }
    asyncEffect()
  }, [])

  useEffect(() => {
    const spaceRegex = /[ ]+/g
    if (searchText == null || spaceRegex.test(searchText)) {
      setPacks(fullPacks)
      return
    }
    if (searchText.length == 0) {
      setPacks(fullPacks)
      return
    }
    const newPacks = packs.filter((pack: any) => {
      return pack.name.toLowerCase().includes(searchText.toLowerCase())
    })
    if (newPacks.length == 0) {
      setPacks([{ name: "Invalid Search", card_count: 0 }])
    }
    setPacks(newPacks)
    setSearching(false)
  }, [searchText])
  return (
    <div className='overflow-hidden w-1/3 p-1 m-2 rounded-lg shadow-lg'>
      {state.user.isHost ? <div className='mb-1 bg-inherit '>
        <h3>Packs: Only Official <input type="checkbox" name="onlyOfficial" id="onlyOfficial" onChange={(e) => setOnlyOfficial(e.target.checked)} /></h3>
        <input className='w-auto' type="text" onChange={(e) => { setSearchText(e.target.value) }} placeholder="search" />
      </div> : <h3>Packs</h3>}

      {searching ?
        <div>Searching</div> :
        <div className='h-full py-1 overflow-scroll pb-16'>
          {
            state.user.isHost ?
              packs.map((pack: any, i) => {
                if (onlyOfficial && !pack.official) {
                  return
                }
                return <PackSelectionItem key={i} idx={i} pack={pack} socket={socket} />
              })
              :
              packs.filter((pack) => {
                return state.room.packs.map((statePack) => statePack.pack_id).includes(pack.pack_id)
              }).map((filteredPack: any, i) => {
                if (onlyOfficial && !filteredPack.official) {
                  return
                }
                return <PackSelectionDisplayItem key={i} pack={filteredPack} />


              })

          }
        </div>
      }
      {/* <div>{JSON.stringify(state.room)}</div> */}
    </div>
  )
}
