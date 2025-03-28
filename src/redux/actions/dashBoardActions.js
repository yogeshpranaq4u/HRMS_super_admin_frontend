import { types } from "../constants/types";

export const getDashBoardData = (data) => ({
    type: types.GET_DASHBOARDATA_REQUEST,
    payload:data
});