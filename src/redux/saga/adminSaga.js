import { toast } from "react-toastify";
import { callApi } from "../../config/apiCall";
import { Api, Saas_Api } from "../../config/apiEndPoints";
import { useNavigate } from "react-router-dom";
import { types } from "../constants/admintype";
import { call, put, takeLatest } from "redux-saga/effects";
import { API_BASE_URL } from "../../saas/Config/Api";

const userDetails = sessionStorage.getItem("userDetails")
  ? JSON.parse(sessionStorage.getItem("userDetails"))
  : {};

export function* getEmployeeAction(action) {
  try {
    const response = yield call(
      callApi,
      Saas_Api?.GET_EMPLOYEE,
      "GET",
      null,
      userDetails?.token,
      API_BASE_URL
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
    
          yield put({
            type: types.GET_EMPLOYEEDATA_SUCCESS,
            payload: response?.data,
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
      toast.error(response?.data?.mssg, {
        position: "top-center",
        autoClose: 1500,
      });
    }
  } catch (error) {
    yield put({ type: types.GET_EMPLOYEEDATA_FAILED, error: error.response });
  }
}

export function* watchGetEmployeedDataAction() {
  yield takeLatest(types.GET_EMPLOYEEDATA_REQUEST, getEmployeeAction);
}

export function* getEmployeeAttendanceAction(action) { 
  try {
    const response = yield call(
      callApi,
      Saas_Api?.GET_ATTENDANCE,
      "GET",
      null,
      userDetails?.token,
      API_BASE_URL
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
        
          yield put({
            type: types.GET_EMPLOYEE_ATTENDANCE_SUCCESS,
            payload: response?.data,
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
      toast.error(response?.data?.mssg, {
        position: "top-center",
        autoClose: 1500,
      });
    }
  } catch (error) {
    yield put({
      type: types.GET_EMPLOYEE_ATTENDANCE_FAILED,
      error: error.response,
    });
  }
}
export function* watchGetEmployeeAttendanceAction() {
  yield takeLatest(
    types.GET_EMPLOYEE_ATTENDANCE_REQUEST,
    getEmployeeAttendanceAction
  );
}

export function* getEmployeeLeaveWfhRequestAction(action) {
  try {
    const response = yield call(
      callApi,
      Saas_Api?.GET_ALL_LEAVE_WFH_REQUEST,
      "GET",
      null,
      userDetails?.token,
      API_BASE_URL
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          console.log("responseall", response?.data);
          yield put({
            type: types.GET_EMPLOYEE_LEAVE_WFH_SUCCESS,
            payload: response?.data,
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
      toast.error(response?.data?.mssg, {
        position: "top-center",
        autoClose: 1500,
      });
    }
  } catch (error) {
    yield put({
      type: types.GET_EMPLOYEE_LEAVE_WFH_FAILED,
      error: error.response,
    });
  }
}
export function* watchGetEmployeeLeaveWfhRequestAction() {
  yield takeLatest(
    types.GET_EMPLOYEE_LEAVE_WFH_REQUEST,
    getEmployeeLeaveWfhRequestAction
  );
}