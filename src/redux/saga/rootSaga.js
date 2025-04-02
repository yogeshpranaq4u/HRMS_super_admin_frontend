import { all } from "redux-saga/effects";
import {
  watchDemoRequestsAction,
  watchGetDashDataAction,
  watchGetPurchaseSummaryAction,
  watchGetPendingDemoRequestAction,
  watchGetRecentTransactionAction,
  watchGetPlantExpireDataAction,
  watchGetRecentRegistrationAction,
} from "./dashboardSaga";

function* rootSaga() {
  yield all([
    watchGetDashDataAction(),
    watchGetPurchaseSummaryAction(),
    watchGetPendingDemoRequestAction(),
    watchGetRecentTransactionAction(),
    watchGetPlantExpireDataAction(),
    watchGetRecentRegistrationAction(),

    watchDemoRequestsAction(),
  ]);
}

export default rootSaga;
