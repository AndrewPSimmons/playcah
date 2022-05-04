import e from 'express'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WhiteCardHand from '../../../components/reuse/WhiteCardHand'
import { blankCardType, playerType, stateType, whiteCardType } from '../../../types'


export default function HandDisplay({ socket }: any) {
    const state: stateType = useSelector((store: stateType) => store)
    const gameState = useSelector((store: stateType) => store.game.gameState)
    const firstLoad = useRef(false)
    const [submitted, setSubmitted] = useState(false)

    const handReducer = (reducerState: whiteCardType[], action: any): any => {
        if (state.game.judgeId == state.user._id || submitted) return reducerState
        switch (action.type) {
            case 'reset':
                return [...action.payload]
            case 'addCard':
                if (reducerState.length == state.game.blackCard?.pick) {
                    return [...reducerState]
                }
                const existingInState: Array<any> = reducerState.filter((card: whiteCardType) => card.id == action.payload.id)
                if (existingInState.length > 0) {
                    return reducerState
                }
                return [...reducerState, action.payload]
            case 'trimCards':
                reducerState.length = action.payload - 1
                return [...reducerState]
            case 'addBlankCard':
                let newCard: any = {}
                const state2 = reducerState
                const lastItem: any = state2.pop()

                if (lastItem == undefined) return [...reducerState]
                console.log("last Item", lastItem);
                if (lastItem._id == "blank") {
                    newCard = {
                        _id: "blank",
                        text: action.payload,
                        pack: 0,
                        id: lastItem.oldId,
                        isBlank: true,
                        oldId: lastItem.oldId
                    }
                } else {
                    newCard = {
                        _id: "blank",
                        text: action.payload,
                        pack: 0,
                        id: lastItem.id,
                        isBlank: true,
                        oldId: lastItem.id
                    }
                }
                state2.push(newCard)

                return [...state2]
            default:
                return state
        }
    }
    const [selected, dispatchSelected] = useReducer(handReducer, [])
    const [gettingBlank, setGettingBlank] = useState(false)
    const [blankCardText, setBlankCardText] = useState("")

    const thisPlayer = useSelector((store: stateType) => {
        return store.game.players?.filter((player: playerType) => {
            return player._id == state.user._id
        })[0]
    })
    useEffect(() => {
        if (selected.length == 0) {
            setGettingBlank(false)
            setBlankCardText("")
        }
        setBlankCardText(getDefaultValue())
    }, [selected])
    useEffect(() => {
        setSubmitted(state.game.cardsOnTable?.filter((obj: any) => { return obj.userId == state.user._id }).length == 1)
    }, [])

    useEffect(() => {
        if (firstLoad.current == false) {
            firstLoad.current = true
        } else {
            setSubmitted(state.game.cardsOnTable?.filter((obj: any) => { return obj.userId == state.user._id }).length == 1)
            dispatchSelected({type: "reset", payload: []})
        }
    }, [gameState])
    const doBlankCard = () => {
        if (selected.length == 0) {
            alert("no card selected")
            return
        }
        if (!gettingBlank) {
            setGettingBlank(true)
            return
        }
        if (blankCardText.length == 0) {
            alert("Blank Card Text is empty")
            return
        }
        //Gather text somehow
        dispatchSelected({ type: "addBlankCard", payload: blankCardText })
        setBlankCardText("")
        setGettingBlank(false)
    }

    const getDefaultValue = () => {
        console.log("default");
        if (selected.length == 0) {
            return ""
        }
        const diff = [...selected]
        const lastEl: whiteCardType = diff.pop()
        console.log(lastEl.text);
        return lastEl.text
    }
    const submitSelected = () => {
        if (selected.length != state.game.blackCard?.pick) {
            alert("Not enough cards selected")
            return
        }
        socket.emit("submittingCards", { userId: state.user._id, username: state.user.username, cards: selected })
        setSubmitted(true)
        dispatchSelected({ type: 'reset', payload: [] })
        console.log("submitting: ", selected);
    }
    return (
        <div className='flex flex-col'>
            <div className='flex space-x-2 overflow-x-scroll items-center px-8'>
                {thisPlayer?.hand.map((card: whiteCardType) => {
                    return <WhiteCardHand key={card.id} cardProp={card} selected={selected} selectedDispatch={dispatchSelected} />
                })}
            </div>
            {/* Test to see if user is judge */}
            {state.game.judgeId == state.user._id ? <button className='m-2 bg-green-500 disabled text-white font-bold py-2 px-4 rounded'>You are Judge</button>


                : <div className='flex flex-col items-center justify-center'>

                    {/* Check if user submitted card by  checking cards on table and matching id */}
                    {submitted
                        ? <button className='m-2 bg-green-500 text-white font-bold py-2 px-4 rounded'>Submitted</button>
                        : <button onClick={() => submitSelected()} className='m-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Submit</button>
                    }

                    {/* Checks game settigs and if use blank cards is set then show blank card option */}
                    {state.game.settings?.useBlankCards && <div className='flex space-x-2'>
                        {state.game.settings && <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => doBlankCard()}>{gettingBlank ? "Set Blank Card" : "Use Blank Card"}</button>}
                    </div>}

                    {/* Open input text if currently getting blank card txt */}
                    {gettingBlank && <div className='flex w-full'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => { setGettingBlank(false) }}>Cancel</button>
                        <input className='border-2 border-black m-2 w-full' type="text" value={blankCardText} onChange={(e) => setBlankCardText(e.target.value)} />
                    </div>}
                    {/* <div>{JSON.stringify(selected)}</div> */}
                </div>}
        </div>
    )
}