import * as actionTypes from "../actionTypes"
import initialState from "../initialState"

const chatReducer = (state = initialState.chat, { type, payload }: any) => {
    switch (type) {
        case actionTypes.NEW_MESSAGE:
            const messages:any = state.messages
            if(messages.length > 20){
                messages.shift()
            }
            messages.push(payload)
            return {...state, messages: messages}
            
        case actionTypes.SET_NULL:
        case actionTypes.CHAT_SET_NULL:
            return {...initialState.chat}
        default:
            return state
    }
}

export default chatReducer