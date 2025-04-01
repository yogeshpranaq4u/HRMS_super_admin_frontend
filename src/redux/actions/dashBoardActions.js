import { types } from "../constants/types";

export const getDashBoardData = (data) => ({
    type: types.GET_DASHBOARDATA_REQUEST,
    payload:data
});
export const getDemoRequestData = (data) => ({
    type: types.GET_DEMOREQUEST_REQUEST,
    payload:data
});