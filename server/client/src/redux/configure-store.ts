import {createStore} from "redux"
import allReducer from "./reducers"
import { loadState, saveState } from "./sessionStorage"

const persistedState = loadState();

let store = createStore(
    allReducer,
    persistedState,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => {
    saveState(store.getState());
  });
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch