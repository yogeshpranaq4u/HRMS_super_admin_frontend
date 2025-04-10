import { toast } from "react-toastify";
import { callApi } from "../../config/apiCall";
import { Api } from "../../config/apiEndPoints";
import { types } from "../constants/types";
import { call, put, takeLatest } from "redux-saga/effects";

const userDetails = sessionStorage.getItem("userDetails")
  ? JSON.parse(sessionStorage.getItem("userDetails"))
  : {};

  
export function* getCompanyAction(action) {
  try {
    const { limit = 5, page = 1, sort = 'last_7_days', plan_id, status } = action?.payload || {};

    // You can also dynamically build this query string if deliver and demo_status are needed
    const queryParams = new URLSearchParams({
      limit,
      page,
      sort,
      ...(plan_id && { plan_id }),
      ...(status && { status })
    }).toString();

    const queryUrl = `?${queryParams}`;
    // console.log(queryUrl);
    const response = yield call(
      callApi,
      Api?.GETCOMPANIES+queryUrl,
      "GET",
      null,
      userDetails?.token
    );
    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          yield put({
            type: types.GET_COMPANIES_SUCCESS,
            payload: response,
          });
        } else {
          toast.error(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1500,
          });
        }
      } else {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } else {
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({ type: types.GET_COMPANIES_FAILED, error: error.response });
  }
}

export function* watchGetCompanyAction() {
  yield takeLatest(types.GET_COMPANIES_REQUEST, getCompanyAction);
}

  
export function* getPlanHistoryAction(action) {
  try {
    const response = yield call(
      callApi,
      `super-admin/companies/${action?.payload}/plans`,
      "GET",
      null,
      userDetails?.token
    );
    // console.log("response response" ,response);
    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          yield put({
            type: types.GET_PLANHISTORY_SUCCESS,
            payload: response,
          });
        } else {
          toast.error(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1500,
          });
        }
      } else {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } else {
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({ type: types.GET_PLANHISTORY_FAILED, error: error.response });
  }
}

export function* watchGetPlanHistoryAction() {
  yield takeLatest(types.GET_PLANHISTORY_REQUEST, getPlanHistoryAction);
}
