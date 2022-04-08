import * as actionTypes from "../actionTypes"
import initialState from "../initialState"

const userReducer = (state = initialState.user, { type, payload }: any) => {
  switch (type) {

    case actionTypes.USER_INT:
      return {...state, ...payload}
      
    case actionTypes.USER_NEW_ID:
      return { ...state, ...payload }

    default:
      return state
  }
}

export default userReducer
