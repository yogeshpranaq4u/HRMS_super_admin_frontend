import { toast } from "react-toastify";
// import { callApi } from "../../config/apiCall";
import { callApi } from "../../config/apiCall";
import { Api } from "../../config/apiEndPoints";

import { types } from "../constants/types";
import { call, put, takeLatest } from "redux-saga/effects";

const userDetails = sessionStorage.getItem("userDetails")
  ? JSON.parse(sessionStorage.getItem("userDetails"))
  : {};

export function* getDashDataAction(action) {
  try {
    const response = yield call(
      callApi,
      Api?.DASHBOARD_STATS,
      "GET",
      null,
      userDetails?.token
    );

    // if (response?.authenticated && response?.success && response?.valid) {
    //     console.log("responsewwwwww", response?.data);
    //   yield put({
    //     type: types.GET_DASHBOARDATA_SUCCESS,
    //     payload: response?.data,
    //   });

    // }
    // else{

    // }
    if (response?.authenticated) {
      if (response?.valid && response?.success) {
        yield put({
          type: types.GET_DASHBOARDATA_SUCCESS,
          payload: response?.data,
        });
      } else {
        yield put({
            type: types.GET_DASHBOARDATA_SUCCESS,
            payload: response?.data,
          });
      }
    } else {
    }
  } catch (error) {
    yield put({ type: types.GET_DASHBOARDATA_FAILED, error: error.response });
  }
}

export function* watchGetDashDataAction() {
  yield takeLatest(types.GET_DASHBOARDATA_REQUEST, getDashDataAction);
}



export function* getDemoRequestsAction(action) {
    try {
        const response = yield call(callApi, "request-demo", "GET", "", userDetails?.token) 
        // console.log(response , "<<<<<sdf");
        if (response.success && response.valid) {
                yield put({ type: types.GET_DEMOREQUEST_SUCCESS, payload: response?.data })
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

