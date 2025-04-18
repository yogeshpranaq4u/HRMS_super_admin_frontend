import { all } from "redux-saga/effects";
import {
  watchDemoRequestsAction,
  watchGetDashDataAction,
  watchGetPurchaseSummaryAction,
  watchGetPendingDemoRequestAction,
  watchGetRecentTransactionAction,
  watchGetPlantExpireDataAction,
  watchGetRecentRegistrationAction,
  watchPlansAction,
} from "./dashboardSaga";
import { watchGetCompanyAction, watchGetPlanHistoryAction, watchGetServiceTypeAction } from "./companyDataSaga";
import { watchGetEmployeeAction, watchGetEmployeeProfileAction, watchGetHolidaysAction, watchGetReminderDetailsAction } from "./employeeSaga";
import { watchGetEmployeedDataAction, watchGetEmployeeAttendanceAction,watchGetEmployeeLeaveWfhRequestAction} from "./adminSaga";

function* rootSaga() {
  yield all([
    watchGetDashDataAction(),
    watchGetPurchaseSummaryAction(),
    watchGetPendingDemoRequestAction(),
    watchGetRecentTransactionAction(),
    watchGetPlantExpireDataAction(),
    watchGetRecentRegistrationAction(),

    watchDemoRequestsAction(),
    watchPlansAction(),
    watchGetCompanyAction(),
    watchGetPlanHistoryAction(),
    watchGetServiceTypeAction(),

    // saas sagas
    watchGetEmployeeProfileAction(),
    watchGetHolidaysAction(),
    watchGetReminderDetailsAction(),

    //Admin Saga
    watchGetEmployeedDataAction(),
    watchGetEmployeeAttendanceAction(),
    watchGetEmployeeLeaveWfhRequestAction()








  ]);
}

export default rootSaga;
