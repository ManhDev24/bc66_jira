import { createSlice } from '@reduxjs/toolkit'
import { getLocalStorage } from '../../utils'
import { CurrentUser } from '../../interface/user.interface'
import fetcher from '../../apis/fetcher'

const userLocalStorage = getLocalStorage<CurrentUser>('user')

type UserState = {
  currentUser: CurrentUser | null
  userProfile: null,
  userList: [],
  userByProjectId: null,
  me: null,
}
const initialState: UserState = {
  currentUser: userLocalStorage,
  userProfile: null,
  userList: [],
  userByProjectId: null,
  me: null,
 
}


const userSlices = createSlice({
  name: 'user',
  initialState,
  
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    },
    signOut: (state) => {
      state.currentUser = null
    },
    getAllUserAction: (state, action) => {
      state.userList = action.payload;
    },
  },
  
})
export const getAllUserApi = () => {
  return async (dispatch:any) => {
    const result = await fetcher.get("/Users/getUser");
    const action = getAllUserAction(result.data.content);
    dispatch(action);
  };
};

export const { setUser, signOut ,getAllUserAction} = userSlices.actions

export default userSlices
