import React from 'react'

export default function WhatCardSubmitted({card, idx}: any) {
  return (
    <div className='flex flex-col flex-shrink-0 justify-between border-2 border-black bg-inherit  text-sm text-left h-44 w-32 p-2'>
      <div>
        {card.text == 'hidden' ? "Play CAH" : card.text}
      </div>
      {card.text != 'hidden' && <div className=''>
        <div className='flex justify-between'>
          <div>{idx+1}</div>
          <div>{card.id}</div>
        </div>
      </div>}
    </div>
  )
}
