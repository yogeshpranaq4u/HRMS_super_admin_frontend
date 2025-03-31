import { combineReducers } from 'redux';
import commenDataReducer from './commenDataReducer';

const rootReducer = combineReducers({
  commenData:commenDataReducer,
});

export default rootReducer;