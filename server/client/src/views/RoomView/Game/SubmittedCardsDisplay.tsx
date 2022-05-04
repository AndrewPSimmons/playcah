import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CardSet from '../../../components/reuse/CardSet'
import { stateType, whiteCardType } from '../../../types'

export default function SubmittedCardsDisplay({ classes, socket}: any) {
  const state = useSelector((store: stateType) => store)
  const [selected, setSelected] = useState<null | any>(null)
  const [hasSelected, setHasSelected] = useState(false)
  const clicked = (cardSet: any) => {
    if (state.user._id != state.game.judgeId) { return }
    if (state.game.gameState == "submit" ) {return}
    if (selected == null) {
      setSelected(cardSet)
      return
    }
    if (selected.userId == cardSet.userId) {
      setSelected(null)
    }
    else {
      setSelected(cardSet)
    }
  }


  const answerSelected = () => {
    console.log('in answerSelect');
    if(hasSelected){return}
    console.log('in answerSelect 2');

    console.log(selected);
    socket.emit("selectingWinner", selected)
    setHasSelected(true)
  }
  return (
    <div className={classes + ' ' + "flex flex-col justify-center items-center"}>
      <div className={classes + ' ' + "flex space-x-2 justify-center items-center overflow-x-scroll"}>
        {state.game.cardsOnTable?.map((cardSet: any) => {
          return <div onClick={() => { clicked(cardSet) }} className={selected && selected.userId == cardSet.userId ? " bg-gray-200 border-2 border-black" : "bg-white border-2 border-transparent" + "flex-grow-0 flex-shrink-0"}>
            <CardSet cardSet={cardSet.cards} />
          </div>
        })}
        {/* <div>{JSON.stringify(selected)}</div> */}
      </div>
      <div className={ selected == null ? "invisible" : ""}>
        {state.game.judgeId != state.user._id ? <button></button>:
        <button onClick={answerSelected} className="mt-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Select</button>}
      </div>
    </div>
  )
}
