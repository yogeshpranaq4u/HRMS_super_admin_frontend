import { toast } from "react-toastify";
import { callApi } from "../../config/apiCall";
import { Api } from "../../config/apiEndPoints";
import { useNavigate } from "react-router-dom";
import { types } from "../constants/admintype"
import { call, put, takeLatest } from "redux-saga/effects";
import { API_BASE_URL } from "../../saas/Config/Api";

const userDetails = sessionStorage.getItem("userDetails")
  ? JSON.parse(sessionStorage.getItem("userDetails"))
  : {};

  export function* getEmployeeAction(action) {
    try {
      const response = yield call(
        callApi,
        Api?.DASHBOARD_STATS,
        "GET",
        null,
        userDetails?.token,
        API_BASE_URL
      );
  
      console.log("response" ,response);
      
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
        // sessionStorage.removeItem("userDetails");
        // window.location.href = "/login";
      }
    } catch (error) {
      yield put({ type: types.GET_EMPLOYEEDATA_FAILED, error: error.response });
    }
  }
  
  export function* watchGetEmployeeAction() {
    yield takeLatest(types.GET_EMPLOYEEDATA_REQUEST, getEmployeeAction);
  }
  