import { types } from "../constants/types";

export const getHolidayData = (data) => ({
    type: types.GET_HOLIDAY_REQUEST,
    payload:data
});
export const getEmployeeProfile = (data) => ({
    type: types.GET_EMPLOYEEPROFILE_REQUEST,
    payload:data
});
export const getReminder = (data) => ({
    type: types.GET_REMINDER_REQUEST,
    payload:data
});

