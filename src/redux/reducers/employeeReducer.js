import { types } from "../constants/types";
// reducers/postReducer.js
const initialState = {
  profile: {},
  holidayList:[],
  reminder:{},
  loading: false,
  error: null,
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_EMPLOYEEPROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EMPLOYEEPROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
      };
    case types.GET_EMPLOYEEPROFILE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case types.GET_HOLIDAY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_HOLIDAY_SUCCESS:
      return {
        ...state,
        loading: false,
        holidayList: action.payload,
      };
    case types.GET_HOLIDAY_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

   
    case types.GET_REMINDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_REMINDER_SUCCESS:
      return {
        ...state,
        loading: false,
        reminder: action.payload,
      };
    case types.GET_REMINDER_FAILED:
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
