import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlices from './slices/user_slice'
import projectReducer from './slices/project_slices'
const rootReducer = combineReducers({
  [userSlices.name]: userSlices.reducer,
  projectReducer: projectReducer.reducer,
  userReducer:userSlices.reducer
})

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
