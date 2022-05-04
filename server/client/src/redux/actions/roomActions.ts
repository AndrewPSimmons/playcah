import * as actionTypes from "../actionTypes"

export const roomInit = (roomCode: string, members: any) => {
    return {
        type: actionTypes.ROOM_INIT,
        payload: {
            roomCode,
            members,
        }
    }
}
export const roomNewData = (roomData: any) => {
    return {
        type: actionTypes.ROOM_NEW_DATA,
        payload: roomData
    }
}
export const roomSetNull = ()=> {
    return {
        type: actionTypes.ROOM_SET_NULL,
        payload: {}
    }
}

export const roomGameStart = (gameID: string) => {
    return {
        type: actionTypes.ROOM_GAME_START,
        payload: {
            gameID
        }
    }
}