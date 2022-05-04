import React from 'react'
import { useSelector } from 'react-redux'
import { blackCardType, stateType } from '../../../types'

export default function BlackCardDisplay({ classes }: any) {
    const blackCard: blackCardType | null = useSelector((store: stateType) => store.game.blackCard)
    return (
        <div className={classes + ' ' + 'flex items-center justify-center'}>
            <div className = 'text-white bg-black px-4 py-2 w-40 h-56 flex flex-col justify-between'>
                <div>{blackCard && blackCard.text}</div>
                <div className='text-right text-sm'>{blackCard && blackCard.id}</div>
            </div>
        </div>
    )
}
