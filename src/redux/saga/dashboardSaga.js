import { callApi } from "../../config/apiCalls";
import { types } from "../constants/types";
import { call, put, takeLatest } from "redux-saga/effects";

const userDetails = localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")) : {}

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

