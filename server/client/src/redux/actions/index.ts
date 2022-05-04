import * as actionTypes from "../actionTypes"


export const setNull = () => {
    return {
        type: actionTypes.SET_NULL,
        payload: {}
    }
}