import * as actionTypes from "../actionTypes"


export const newMessage = (message: string, username: string) => {
    return {
        type: actionTypes.NEW_MESSAGE,
        payload: {
            message,
            username
        }
    }
}

export const chatSetNull = () => {
    return {
        type: actionTypes.CHAT_SET_NULL,
        payload: {}
    }
}