import * as actionTypes from "../actionTypes"

export const userInit = (_id: string, username: string) => {
    return {
        type: actionTypes.USER_INT,
        payload: {
            _id: _id,
            username
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