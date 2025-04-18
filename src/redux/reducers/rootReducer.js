import { combineReducers } from "redux";
import commenDataReducer from "./commenDataReducer";
import otherReducer from "./otherReducer";
import employeeReducer from "./employeeReducer";
import adminReducer from "./adminReducer";


const rootReducer = combineReducers({
  commenData: commenDataReducer,
  data: otherReducer,
  employeeData: employeeReducer,
  adminData: adminReducer,
});

export default rootReducer;
