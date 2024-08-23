import { createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";

const initialState = {
  statusTypes: [],
};

const statusReducer = createSlice({
  name: "statusReducer",
  initialState,
  reducers: {
    getAllStatusTypesAction: (state, action) => {
      state.statusTypes = action.payload;
    },
  },
});

export const { getAllStatusTypesAction } = statusReducer.actions;

export default statusReducer;

export const getAllStatusTypesApi = () => {
  return async (dispatch) => {
    const result = await fetcher.get(`/Status/getAll`);
    const action = getAllStatusTypesAction(result.data.content);
    dispatch(action);
  };
};