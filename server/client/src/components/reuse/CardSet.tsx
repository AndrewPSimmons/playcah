import React from 'react'
import { whiteCardType } from '../../types'
import WhatCardSubmitted from './WhatCardSubmitted'

export default function CardSet({ cardSet }: any) {

    return (
        <div className='flex bg-inherit hover:bg-gray-300'>
            {cardSet.map((card: whiteCardType, i: number) => {
                return <WhatCardSubmitted key={card._id} idx={i} card={card} />
            })}
        </div>
    )
}
