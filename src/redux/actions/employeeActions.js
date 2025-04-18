import { types } from "../constants/types";

export const getEmployeeData = (data) => ({
    type: types.GET_EMPLOYEEDATA_REQUEST,
    payload:data
});

