import * as actionTypes from "../actionTypes"

export const userInit = (_id: string, username: string, isHost: boolean, roomCode: string) => {
    return {
        type: actionTypes.USER_INT,
        payload: {
            _id: _id,
            username,
            isHost,
            roomCode
        }
    }
}
export const userNewId = (_id: string) => {
    return {
        type: actionTypes.USER_NEW_ID,
        payload: {
            _id: _id
        }
    }
}

export const userSetNull = ()=>{
    return {
        type: actionTypes.USER_SET_NULL,
        payload: {}
    }
}