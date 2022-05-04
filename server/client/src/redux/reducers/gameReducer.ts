import * as actionTypes from "../actionTypes"
import initialState from "../initialState"

const gameReducer = (state = initialState.game, { type, payload }: any) => {
    switch (type) {
        case actionTypes.SET_NULL:
        case actionTypes.GAME_SET_NULL:
            return {...initialState.game}
        case actionTypes.GAME_NEW_DATA:
            console.log("Settings game data to: ", payload)
            return {...payload}
        default:
            return state
    }
}

export default gameReducer