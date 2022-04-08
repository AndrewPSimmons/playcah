import * as actionTypes from "../actionTypes"

export const roomInit = (roomCode: string) => {
    return {
        type: actionTypes.ROOM_INIT,
        payload: {
            roomCode
        }
    }
}