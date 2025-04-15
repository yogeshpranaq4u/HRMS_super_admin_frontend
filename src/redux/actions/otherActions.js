import { types } from "../constants/types";


export const getServiceType = (data) => ({
    type: types.GET_SERVICETYPE_REQUEST,
    payload:data
});