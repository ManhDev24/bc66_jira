import { createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

const initialState = {
  priority: [],
};

const priorityReducer = createSlice({
  name: "priorityReducer",
  initialState,
  reducers: {
    getAllPriorityAction: (state, action) => {
      state.priority = action.payload;
    },
  },
});

export const { getAllPriorityAction } = priorityReducer.actions;

export default priorityReducer;

export const getAllPriorityApi = () => {
  return async (dispatch) => {
    const result = await fetcher.get(`/Priority/getAll`);
    const action = getAllPriorityAction(result.data.content);
    dispatch(action);
  };
};