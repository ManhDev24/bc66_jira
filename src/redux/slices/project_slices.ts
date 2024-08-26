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
        state.projectMembers = action.payload || [];
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

export const assignUserToProjectApi = (addUser:any, callback: { (): void; (): void; }) => {
  return async (dispatch:any) => {
    try {
      const response = await fetcher.post(`/Project/assignUserProject`, addUser);
      if (response.status === 200) {
        console.log('User assigned successfully:', response.data);
        if (callback) {
          callback(); // Gọi callback nếu có
        }
      } else {
        console.error('Failed to assign user:', response.status, response.statusText);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.statusCode === 403) {
        dispatch(setProjectErrorNullAction(error.response.data.content));
      }
    }
  };
};

export const removeUserFromProjectApi = (data:any, callback: { (): void; (): void; }) => {
  return async (dispatch: (arg0: { payload: any; type: "projectReducer/setProjectErrorNullAction"; }) => void) => {
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
  return async (dispatch: (arg0: { payload: any; type: "projectReducer/getUsersByProjectIdAction"; }) => void) => {
    try {
      const result = await fetcher.get(
        `/Users/getUserByProjectId?idProject=${projectId}`
      );
      const data = result.data.content || [];
      const action = getUsersByProjectIdAction(data);
      dispatch(action);

    } catch (error) {
      const action = getUsersByProjectIdAction(null);
      dispatch(action);
    }
  };
};

export const getAllProject = () =>{
  return async (dispatch: (arg0: { payload: any; type: "projectReducer/getAllProjectCategoryAction"; }) => void) => {
    const result = await fetcher.get(`/Project/getAllProject`);
    const action = getAllProjectCategoryAction(result.data.content);
    dispatch(action);
  };
}

export const deleteProjectApi =(projectId:any)=>{
  //Project/deleteProject
  return async (dispatch: any) => {
    await fetcher.delete(`/Project/deleteProject?projectId=${projectId}`);
    window.location.reload();
  };
}

export const updateProjectApi = (projectUpdate) => {
  return async (dispatch) => {
    await fetcher.put(
      `/Project/updateProject?projectId=${projectUpdate.id}`,
      projectUpdate
    );
    window.location.reload();
  };
};
export const getProjectDetailApi = (projectId) => {
  return async (dispatch) => {
    const result = await fetcher.get(`/Project/getProjectDetail?id=${projectId}`);
    const action = getProjectDetailAction(result.data.content);
    dispatch(action);
  };
};