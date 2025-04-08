import { types } from "../constants/types";
// reducers/postReducer.js
const initialState = {
  dashData: {},
  purchaseSummaryData: [],
  pendingDemoRequestsData: [],
  recentRegistrations: [],
  planExpireData: [],
  recentTransaction: [],
  demoRequestsData: [],
  companiesData: {},
  allPlans: {},
  profileData: {},
  loading: false,
  error: null,
};

const commenDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DASHBOARDATA_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DASHBOARDATA_SUCCESS:
      return {
        ...state,
        loading: false,
        dashData: action.payload,
      };
    case types.GET_DASHBOARDATA_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_PURCHASE_SUMMARY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PURCHASE_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: false,
        purchaseSummaryData: action.payload,
      };
    case types.GET_PURCHASE_SUMMARY_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_PENDING_DEMO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PENDING_DEMO_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingDemoRequestsData: action.payload,
      };
    case types.GET_PENDING_DEMO_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_RECENT_REGISTRATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_RECENT_REGISTRATIONS_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        recentRegistrations: action.payload,
      };
    case types.GET_RECENT_REGISTRRATIONS_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_PLAN_EXPIRE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PLAN_EXPIRE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        planExpireData: action.payload,
      };
    case types.GET_PLAN_EXPIRE_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_RECENT_TRANSACTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_RECENT_TRANSACTION_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        recentTransaction: action.payload,
      };
    case types.GET_RECENT_TRANSACTION_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_DEMOREQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_DEMOREQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        demoRequestsData: action.payload,
      };
    case types.GET_DEMOREQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_PLANS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_PLANS_SUCCESS:
      return {
        ...state,
        loading: false,
        allPlans: action.payload,
      };
    case types.GET_PLANS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case types.GET_COMPANIES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.GET_COMPANIES_SUCCESS:
      return {
        ...state,
        loading: false,
        companiesData: action.payload,
      };
    case types.GET_COMPANIES_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };


    case types.ADD_COMPANIES_SUCCESS:
      return {
        ...state,
        companiesData: {...state.companiesData ,data:[action.payload , ...state.companiesData?.data]},
        loading: false,
      };
    case types.UPDATE_COMPANIES_SUCCESS:
      const updated = state.companiesData?.data?.map((item)=>{
        if(item?.id == action.payload.id){
          return action.payload
        }else{
          return item
        }
      })
      return {
        ...state,
        companiesData: {...state.companiesData ,data:updated},
        loading: false,
      };


    default:
      return state;
  }
};

export default commenDataReducer;
