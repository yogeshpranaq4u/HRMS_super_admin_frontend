import { types } from "../constants/types";

// reducers/postReducer.js
const initialState = {
  dashData: [],
  profileData:{},
  loading: false,
  error: null,
};

const commenDataReducer = (state = initialState, action) => {
  switch (action.type) {
   
    case types.GET_DASHBOARDATA_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.GET_DASHBOARDATA_SUCCESS:
      return {
        ...state,
        loading: false,
        dashData: action.payload
      };
    case types.GET_DASHBOARDATA_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error
      };


    default:
      return state;
  }
};

export default commenDataReducer;