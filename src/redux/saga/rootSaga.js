import {all } from "redux-saga/effects"
import { watchGetDashDataAction } from "./dashboardSaga";


function* rootSaga (){
    yield all([
        watchGetDashDataAction(),
       
    ])
}



export default rootSaga;