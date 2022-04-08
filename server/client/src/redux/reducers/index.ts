import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import testReducer from "./testReducer";
import userReducer from "./userReducer";
//Import Reducer Here
const allReducer = combineReducers({
    user: userReducer,
    room: roomReducer
    //test: testReducer
})

export default allReducer