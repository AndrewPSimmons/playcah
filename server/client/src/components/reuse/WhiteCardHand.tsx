import React, { useEffect, useState } from 'react'
import { blankCardType, whiteCardType } from '../../types'

type PropType = {
  cardProp: whiteCardType,
  selectedDispatch: Function,
  selected: whiteCardType[] 
}
export default function WhiteCardHand({ cardProp, selectedDispatch, selected }: PropType) {
  const [card, setCard] = useState(cardProp)
  const [orderNumber, setOrderNumber] = useState<null | number>(null)
  const [isBlankText, setIsBlankText] = useState<null | string>(null)
  useEffect(() => {
    setOrderNumber(null)
    setIsBlankText(null)
    selected.forEach((selectedCard: blankCardType | whiteCardType, idx: number) => {
      if (selectedCard.id == card.id) {
        setOrderNumber(idx + 1)
      }
      if(selectedCard.isBlank && selectedCard.oldId == card.id){
        console.log("is truee");
        setOrderNumber(idx + 1)
        setIsBlankText(selectedCard.text)
      }
    })
  }, [selected])


  const cardClicked = () => {
    if (!orderNumber) {
      selectedDispatch({ type: "addCard", payload: card })
      return
    }
    selectedDispatch({ type: "trimCards", payload: orderNumber })
  }
  return (
    <div className={orderNumber ? 'bg-gray-200 flex flex-col flex-shrink-0 justify-between border-2 border-black text-sm text-left h-44 w-32 p-2' : 'bg-white flex flex-col flex-shrink-0 justify-between border-2 border-black text-sm text-left h-44 w-32 p-2' }
      onClick={cardClicked}>
      <div>
        {isBlankText ? isBlankText : card.text}
      </div>
      <div className='flex justify-between'>
        <div>{orderNumber && JSON.stringify(orderNumber)}</div>
        <div>{card.id}</div>
      </div>
    </div>
  )
}
