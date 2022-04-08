
import * as actionTypes from "../actionTypes"

const initialState = {test:"true"} 

export default (state = initialState, { type, payload }: any) => {
  switch (type) {
      
  case type==actionTypes.ACTION_NAME:
    return { ...state, ...payload }

  default:
    return state
  }
}
