import { types } from "../constants/admintype";

const initialState = {
    employeeListData: {},
    loading: false,
    error: null,
  };
export const getEmployeeData = (data) => ({
    type: types.GET_EMPLOYEEDATA_REQUEST,
    payload:data
});
