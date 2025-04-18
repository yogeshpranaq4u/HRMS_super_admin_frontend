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
    watchGetServiceTypeAction()
  ]);
}

export default rootSaga;
