import { types } from "../constants/admintype";

const initialState = {
  employeeListData: [],
  employeeAttendanceData: [],
  employeeLeaveWfhRequestData:[],
  loading: false,
  error: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_EMPLOYEEDATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EMPLOYEEDATA_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeListData: action.payload,
      };
    case types.GET_EMPLOYEEDATA_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_EMPLOYEE_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EMPLOYEE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeAttendanceData: action.payload,
      };
    case types.GET_EMPLOYEE_ATTENDANCE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
      
    case types.GET_EMPLOYEE_LEAVE_WFH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_EMPLOYEE_LEAVE_WFH_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeLeaveWfhRequestData: action.payload,
      };
    case types.GET_EMPLOYEE_LEAVE_WFH_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default adminReducer;
