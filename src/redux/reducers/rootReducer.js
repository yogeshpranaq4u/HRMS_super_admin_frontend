import { combineReducers } from 'redux';
import commenDataReducer from './commenDataReducer';
import otherReducer from './otherReducer';
import employeeReducer from './employeeReducer';

const rootReducer = combineReducers({
  commenData:commenDataReducer,
  data:otherReducer,
  employeeData:employeeReducer,
});

export default rootReducer;