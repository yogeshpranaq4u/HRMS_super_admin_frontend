import { types } from "../constants/types";

export const getDashBoardData = (data) => ({
    type: types.GET_DASHBOARDATA_REQUEST,
    payload:data
});
export const getAllPlans = (data) => ({
    type: types.GET_PLANS_REQUEST,
    payload:data
});

export const getCompanies = (data) => ({
    type: types.GET_COMPANIES_REQUEST,
    payload:data
});
export const getPlanHistory = (data) => ({
    type: types.GET_PLANHISTORY_REQUEST,
    payload:data
});
export const addCompany = (data) => ({
    type: types.ADD_COMPANIES_SUCCESS,
    payload:data
});
export const updateCompany = (data) => ({
    type: types.UPDATE_COMPANIES_SUCCESS,
    payload:data
});

export const getPurchaseSummaryData = (data) => ({
    type: types.GET_PURCHASE_SUMMARY_REQUEST,
    payload:data
});

export const getPendingDemoRequestData = (data) => ({
    type: types.GET_PENDING_DEMO_REQUEST,
    payload:data
});


export const getRecentRegistrationData = (data) => ({
    type: types.GET_RECENT_REGISTRATIONS_REQUEST,
    payload:data
});

export const getPlantExpireData = (data) => ({
    type: types.GET_PLAN_EXPIRE_REQUEST,
    payload:data
});

export const getRecenttransactionData = (data) => ({
    type: types.GET_RECENT_TRANSACTION_REQUEST,
    payload:data
});


export const getDemoRequestData = (data) => ({
    type: types.GET_DEMOREQUEST_REQUEST,
    payload:data
});
