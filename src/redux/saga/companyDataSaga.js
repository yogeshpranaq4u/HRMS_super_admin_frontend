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
    const response = yield call(
      callApi,
      Api?.GETCOMPANIES,
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
