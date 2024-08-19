import { createSlice } from "@reduxjs/toolkit";
import fetcher from "../../apis/fetcher";
const initialState = {
    projectList: [],
    projectCategories: [],
    projectMembers: [],
    projectDetail: null,
    projectError: null,
    projectEdit: null,
};

const projectReducer = createSlice({
    name: "projectReducer",
    initialState,
    reducers: {
      getAllProjectAction: (state, action) => {
        state.projectList = action.payload;
      },
      searchProjectAction: (state, action) => {
        state.projectList = action.payload;
      },
      getAllProjectCategoryAction: (state, action) => {
        state.projectCategories = action.payload;
      },
      createProjectAction: (state, action) => {
        state.projectDetail = action.payload;
      },
      createProjectAuthorizeAction: (state, action) => {
        state.projectDetail = action.payload;
      },
      getProjectDetailAction: (state, action) => {
        state.projectDetail = action.payload;
      },
      setProjectDetailNullAction: (state, action) => {
        state.projectDetail = action.payload;
      },
      setProjectErrorNullAction: (state, action) => {
        state.projectError = action.payload;
      },
      getUsersByProjectIdAction: (state, action) => {
        state.projectMembers = action.payload;
      },
      getProjectEditAction: (state, action) => {
        state.projectEdit = action.payload;
      },
    },
  });


  
export const {
    getAllProjectAction,
    searchProjectAction,
    getAllProjectCategoryAction,
    createProjectAction,
    createProjectAuthorizeAction,
    getProjectDetailAction,
    setProjectDetailNullAction,
    setProjectErrorNullAction,
    getUsersByProjectIdAction,
    getProjectEditAction,
  } = projectReducer.actions;
  
  export default projectReducer;


   

export const getAllProjectCategoryApi = () => {
    return async (dispatch: (arg0: { payload: any; type: "projectReducer/getAllProjectCategoryAction"; }) => void) => {
      const result = await fetcher.get(`/ProjectCategory`);
      const action = getAllProjectCategoryAction(result.data.content);
      dispatch(action);
    };
};
  
export const createProjectAuthorizeApi = (project:any, callback:any) => {
    return async (dispatch: (arg0: { payload: any; type: "projectReducer/createProjectAuthorizeAction"; }) => void) => {
      const result = await fetcher.post(`/Project/createProjectAuthorize`, project);
      const action = createProjectAuthorizeAction(result.data.content);
      dispatch(action);
      if (callback) {
        callback();
      }
    };
};

export const assignUserToProjectApi = (addUser:any, callback) => {
  return async (dispatch:any) => {
    try {
      fetcher.post(`/Project/assignUserProject`, addUser);
      if (callback) callback();
    } catch (error) {
      console.log(error);
      if (error.response.data.statusCode === 403) {
        dispatch(setProjectErrorNullAction(error.response.data.content));
      }
    }
  };
};

export const removeUserFromProjectApi = (data:any, callback) => {
  return async (dispatch) => {
    dispatch(setProjectErrorNullAction(null));
    try {
      await fetcher.post("/Project/removeUserFromProject", data);
      if (callback) callback();
    } catch (error) {
      console.log(error);
      if (error.response.data.statusCode === 403) {
        dispatch(setProjectErrorNullAction(error.response.data.content));
      }
    }
  };
};

export const getUsersByProjectIdApi = (projectId:any) => {
  return async (dispatch) => {
    try {
      const result = await fetcher.get(
        `/Users/getUserByProjectId?idProject=${projectId}`
      );
      console.log(result.data.content);
      const action = getUsersByProjectIdAction(result.data.content);
      dispatch(action);
    } catch (error) {
      const action = getUsersByProjectIdAction(null);
      dispatch(action);
    }
  };
};