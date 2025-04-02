import { toast } from "react-toastify";
import { callApi } from "../../config/apiCall";
import { types } from "../constants/types";
import { call, put, takeLatest } from "redux-saga/effects";

const userDetails = sessionStorage.getItem("userDetails") ? JSON.parse(sessionStorage.getItem("userDetails")) : {}

export function* getDashDataAction(action) {
    try {
        const response = yield call(callApi, "get-lead-field", "GET", "", userDetails?.token)        
        if (response.status) {
            yield put({ type: types.GET_DASHBOARDATA_SUCCESS, payload: response?.data })
        }
    } catch (error) {
        yield put({ type: types.GET_DASHBOARDATA_FAILED, error: error.response })
    }
}

export function* watchGetDashDataAction() {
    yield takeLatest(types.GET_DASHBOARDATA_REQUEST, getDashDataAction)
}



export function* getDemoRequestsAction(action) {
    try {
        // console.log("userDetails" , userDetails);
        const response = yield call(callApi, "request-demo", "GET", "", userDetails?.token) 
        // console.log(response , "<<<<<sdf");
        if (response.success && response.valid) {
                yield put({ type: types.GET_DEMOREQUEST_SUCCESS, payload: response })
            }
        } catch (error) {
        // console.log(error , "<<<<<sdf error");
        toast.error(error.response?.data?.message||error.message||"server error")
        yield put({ type: types.GET_DEMOREQUEST_FAILED, error: error.response })
    }
}

export function* watchDemoRequestsAction() {
    yield takeLatest(types.GET_DEMOREQUEST_REQUEST, getDemoRequestsAction)
}

