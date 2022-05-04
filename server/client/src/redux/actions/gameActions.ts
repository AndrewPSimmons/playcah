import * as actionTypes from "../actionTypes"


export const gameSetNull = () => {
    return {
        type: actionTypes.GAME_SET_NULL,
        payload: {
        }
    }
}

export const gameNewData = (roomData: Object) => {
    return {
        type: actionTypes.GAME_NEW_DATA,
        payload: roomData
    }
}