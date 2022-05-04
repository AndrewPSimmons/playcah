import { combineReducers } from "redux";
import chatReducer from "./chatReducer";
import gameReducer from "./gameReducer";
import roomReducer from "./roomReducer";
import testReducer from "./testReducer";
import userReducer from "./userReducer";
//Import Reducer Here
const allReducer = combineReducers({
    user: userReducer,
    room: roomReducer,
    chat: chatReducer,
    game: gameReducer
    //test: testReducer
})

export default allReducer