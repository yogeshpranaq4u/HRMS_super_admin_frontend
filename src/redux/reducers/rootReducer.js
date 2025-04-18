import { combineReducers } from "redux";
import commenDataReducer from "./commenDataReducer";
import otherReducer from "./otherReducer";
import employeeReducer from "./employeeReducer";
import adminReducer from "./adminReducer";
import { normalReducer } from "./normalReducer";


const rootReducer = combineReducers({
  commenData: commenDataReducer,
  data: otherReducer,
  employeeData: employeeReducer,
  adminData: adminReducer,
  normalData:normalReducer,
});

export default rootReducer;
