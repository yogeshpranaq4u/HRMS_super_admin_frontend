import { types } from "../constants/admintype";


const initialState = {
    employeeListData: {},
    loading: false,
    error: null,
  };


const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_EMPLOYEEDATA_REQUEST:
          return {
            ...state,
            loading: true,
          };
        case types.GET_EMPLOYEEDATA_SUCCESS:
          return {
            ...state,
            loading: false,
            employeeListData: action.payload,
          };
        case types.GET_EMPLOYEEDATA_FAILED:
          return {
            ...state,
            loading: false,
            error: action.error,
          };
    
       
    
    
        default:
          return state;
      }
  
}



export default adminReducer

