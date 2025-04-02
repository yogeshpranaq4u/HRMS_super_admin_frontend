import { toast } from "react-toastify";
// import { callApi } from "../../config/apiCall";
import { callApi } from "../../config/apiCall";
import { Api } from "../../config/apiEndPoints";
import { useNavigate } from "react-router-dom";
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
    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          yield put({
            type: types.GET_DASHBOARDATA_SUCCESS,
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
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({ type: types.GET_DASHBOARDATA_FAILED, error: error.response });
  }
}

export function* watchGetDashDataAction() {
  yield takeLatest(types.GET_DASHBOARDATA_REQUEST, getDashDataAction);
}

export function* getPurchaseSummaryAction(action) {
  try {
    const response = yield call(
      callApi,
      Api?.DASHBOARD_PLAN_SUMMARY,
      "GET",
      null,
      userDetails?.token
    );
console.log("responseaaaaa", response);
    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
       
          yield put({
            type: types.GET_PURCHASE_SUMMARY_SUCCESS,
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
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({
      type: types.GET_PURCHASE_SUMMARY_FAILED,
      error: error.response,
    });
  }
}

export function* watchGetPurchaseSummaryAction() {
  yield takeLatest(
    types.GET_PURCHASE_SUMMARY_REQUEST,
    getPurchaseSummaryAction
  );
}

export function* getPendingDemoRequestAction(action) {
  try {
    const response = yield call(
      callApi,
      Api?.DASHBOARD_PENDING_DEMO_REQUEST,
      "GET",
      null,
      userDetails?.token
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          console.log("responseaaaaa", response);
          yield put({
            type: types.GET_PENDING_DEMO_REQUEST_SUCCESS,
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
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({
      type: types.GET_PENDING_DEMO_REQUEST_FAILED,
      error: error.response,
    });
  }
}

export function* watchGetPendingDemoRequestAction() {
  yield takeLatest(types.GET_PENDING_DEMO_REQUEST, getPendingDemoRequestAction);
}

export function* getRecentRegistrationAction(action) {
  try {
    const response = yield call(
      callApi,
      Api?.DASHBOARD_RECENT_REGISTRATIONS,
      "GET",
      null,
      userDetails?.token
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          console.log("responseaaaaa", response);
          yield put({
            type: types.GET_RECENT_REGISTRATIONS_REQUEST_SUCCESS,
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
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({
      type: types.GET_RECENT_REGISTRRATIONS_REQUEST_FAILED,
      error: error.response,
    });
  }
}

export function* watchGetRecentRegistrationAction() {
  yield takeLatest(
    types.GET_RECENT_REGISTRATIONS_REQUEST,
    getRecentRegistrationAction
  );
}

export function* getPlantExpireDataAction(action) {
  try {
    const response = yield call(
      callApi,
      Api?.DASHBOARD_PLAN_EXPIRE,
      "GET",
      null,
      userDetails?.token
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          console.log("responseaaaaa", response);
          yield put({
            type: types.GET_PLAN_EXPIRE_REQUEST_SUCCESS,
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
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({
      type: types.GET_PLAN_EXPIRE_REQUEST_FAILED,
      error: error.response,
    });
  }
}

export function* watchGetPlantExpireDataAction() {
  yield takeLatest(types.GET_PLAN_EXPIRE_REQUEST, getPlantExpireDataAction);
}

export function* getRecentTransactionAction(action) {
  try {
    const response = yield call(
      callApi,
      Api?.DASHBOARD_TRANSACTION,
      "GET",
      null,
      userDetails?.token
    );

    if (response?.authenticated) {
      if (response?.valid) {
        if (response?.success) {
          console.log("responseaaaaa", response);
          yield put({
            type: types.GET_RECENT_TRANSACTION_REQUEST_SUCCESS,
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
      sessionStorage.removeItem("userDetails");
      window.location.href = "/login";
    }
  } catch (error) {
    yield put({
      type: types.GET_RECENT_TRANSACTION_REQUEST_FAILED,
      error: error.response,
    });
  }
}

export function* watchGetRecentTransactionAction() {
  yield takeLatest(
    types.GET_RECENT_TRANSACTION_REQUEST,
    getRecentTransactionAction
  );
}

export function* getDemoRequestsAction(action) {
  try {
    const response = yield call(
      callApi,
      "request-demo",
      "GET",
      "",
      userDetails?.token
    );

    if (response.success && response.valid) {
      yield put({
        type: types.GET_DEMOREQUEST_SUCCESS,
        payload: response?.data,
      });
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "server error"
    );
    yield put({ type: types.GET_DEMOREQUEST_FAILED, error: error.response });
  }
}

export function* watchDemoRequestsAction() {
  yield takeLatest(types.GET_DEMOREQUEST_REQUEST, getDemoRequestsAction);
}
