import { types } from "../constants/admintype";


export const getEmployeeData = (data) => ({
    type: types.GET_EMPLOYEEDATA_REQUEST,
    payload:data
});

export const getEmployeeAttendanceData = (data) => ({
  type: types.GET_EMPLOYEE_ATTENDANCE_REQUEST,
  payload:data
});


export const getEmployeeLeaveWfhRequestData = (data) => ({
  type: types.GET_EMPLOYEE_LEAVE_WFH_REQUEST,
  payload:data
});

