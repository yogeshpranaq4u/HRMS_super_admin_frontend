import { toast } from "react-toastify";
import { callApi } from "../../config/apiCall";
import { Api, Saas_Api, SAAS_BASE_URL } from "../../config/apiEndPoints";
import { types } from "../constants/types";
import { call, put, takeLatest } from "redux-saga/effects";

const userDetails = sessionStorage.getItem("userDetails")
  ? JSON.parse(sessionStorage.getItem("userDetails"))
  : {};

function* getHolidayAction(action) {
  try {
    const response = yield call(
      callApi,
      Saas_Api?.GET_HOLIDAY,
      "GET",
      null,
      userDetails?.token,
      SAAS_BASE_URL
    );

    console.log("response", response);

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          yield put({
            type: types.GET_HOLIDAY_SUCCESS,
            payload: response?.data,
          });
        } else {
          toast.error(response?.data?.mssg);
        }
      } else {
        toast.error(response?.data?.mssg[0]);
      }
    } else {
      // sessionStorage.removeItem("userDetails");
      // window.location.href = "/login";
    }
  } catch (error) {
    yield put({ type: types.GET_HOLIDAY_FAILED, error: error.response });
  }
}

export function* watchGetHolidaysAction() {
  yield takeLatest(types.GET_HOLIDAY_REQUEST, getHolidayAction);
}

function* getEmployeeProfileAction(action) {
  try {
    const response = yield call(
      callApi,
      `${Saas_Api.GET_EMPLOYEE_PROFILE}?employee_id=${action?.payload}`,
      "GET",
      null,
      userDetails?.token,
      SAAS_BASE_URL
    );
    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          yield put({
            type: types.GET_EMPLOYEEPROFILE_SUCCESS,
            payload: response?.data,
          });
        } else {
          toast.error(response?.data?.mssg);
        }
      } else {
        toast.error(response?.data?.mssg[0]);
      }
    } else {
      // sessionStorage.removeItem("userDetails");
      // window.location.href = "/login";
    }
  } catch (error) {
    yield put({ type: types.GET_EMPLOYEEPROFILE_FAILED, error: error.response });
  }
}

export function* watchGetEmployeeProfileAction() {
  yield takeLatest(types.GET_EMPLOYEEPROFILE_REQUEST, getEmployeeProfileAction);
}



function* getReminderDetailsAction(action) {
  try {
    const response = yield call(
      callApi,
      `${Saas_Api.ADMIN_REMINDER}`,
      "GET",
      null,
      userDetails?.token,
      SAAS_BASE_URL
    );

    console.log("response" ,response);
    
    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          yield put({
            type: types.GET_REMINDER_SUCCESS,
            payload: response?.data,
          });
        } else {
          toast.error(response?.data?.mssg);
        }
      } else {
        toast.error(response?.data?.mssg[0]);
      }
    } else {
      // sessionStorage.removeItem("userDetails");
      // window.location.href = "/login";
    }
  } catch (error) {
    yield put({ type: types.GET_REMINDER_FAILED, error: error.response });
  }
}

export function* watchGetReminderDetailsAction() {
  yield takeLatest(types.GET_REMINDER_REQUEST, getReminderDetailsAction);
}
