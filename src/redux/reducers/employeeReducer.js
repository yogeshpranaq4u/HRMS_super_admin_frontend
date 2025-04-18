import { types } from "../constants/types";
// reducers/postReducer.js
const initialState = {
  profile: {},
  loading: false,
  error: null,
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SERVICETYPE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_SERVICETYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        serviceTypeData: action.payload,
      };
    case types.GET_SERVICETYPE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

   


    default:
      return state;
  }
};

export default employeeReducer;
