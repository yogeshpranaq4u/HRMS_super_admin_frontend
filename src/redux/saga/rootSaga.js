import {all } from "redux-saga/effects"
import { watchDemoRequestsAction, watchGetDashDataAction } from "./dashboardSaga";


function* rootSaga (){
    yield all([
        watchGetDashDataAction(),
        watchDemoRequestsAction()
       
    ])
}



export default rootSaga;