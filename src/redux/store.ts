import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlices from './slices/user_slice'
import projectReducer from './slices/project_slices'
import taskReducer from './slices/task_slices'
import priorityReducer from './slices/priority_slices'
import statusReducer from './slices/status_slices'
import commentReducer from './slices/comment_slices'
const rootReducer = combineReducers({
  [userSlices.name]: userSlices.reducer,
  projectReducer: projectReducer.reducer,
  userReducer:userSlices.reducer,
  taskReducer:taskReducer.reducer,
  priorityReducer:priorityReducer.reducer,
  statusReducer:statusReducer.reducer,
  commentReducer:commentReducer.reducer
})

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
