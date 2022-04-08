import * as actionTypes from "../actionTypes"
import initialState from "../initialState"

const roomReducer = (state = initialState.room, { type, payload }:any) => {
    console.log(type, payload)
    switch (type) {
        case actionTypes.ROOM_INIT:
            return {...state, ...payload}
        default:
            return state
    }
}

export default roomReducer