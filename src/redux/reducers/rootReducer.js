import { combineReducers } from 'redux';
import commenDataReducer from './commenDataReducer';
import otherReducer from './otherReducer';

const rootReducer = combineReducers({
  commenData:commenDataReducer,
  data:otherReducer,
});

export default rootReducer;