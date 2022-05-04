import * as actionTypes from "../actionTypes"
import initialState from "../initialState"

const roomReducer = (state = initialState.room, { type, payload }:any) => {
    switch (type) {
        case actionTypes.ROOM_INIT:
            return {...state, ...payload}

        case actionTypes.SET_NULL:
        case actionTypes.ROOM_SET_NULL:
            return {...initialState.room}
        case actionTypes.ROOM_NEW_DATA:
            return {...state, ...payload}
        default:
            return state
    }
}

export default roomReducer