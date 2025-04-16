import Type from '../Redux/Constants'

export const setUserDetails = data => ({
    type: Type.EMPLOYEE_DETAILS,
    payload: data,
  });
  export const setEmployeeAuth = data => ({
    type: Type.EMPLOYEE_AUTH,
    payload: data,
  });
  export const setEmployeeLeaveDetails = data => ({
    type: Type.EMPLOYEE_LEAVE_DETAIL,
    payload: data,
  });
  export const setEmployeeAllDetails = data => ({
    type: Type.EMPLOYEE_ALL_DETAILS,
    payload: data,
  });
  export const setEmployeeindex = data => ({
    type: Type.EMPLOYEE_SELECTED_INDEX,
    payload: data,
  });
  export const setEmployeeHoliday = data => ({
    type: Type.EMPLOYEE_HOLIDAY,
    payload: data,
  });
  export const setAssetsData = data => ({
    type: Type.ASSET_MANAGEMENT,
    payload: data,
  });
  export const setAssetsAssignData = data => ({
    type: Type.ASSET_ASSIGN_MANAGEMENT,
    payload: data,
  });
  export const setAssetIndex = data => ({
    type: Type.ITEM_ASSET_HEADER_SELECT,
    payload: data,
  });
  export const setCustomeDetails = data => ({
    type: Type.ADD_CUSTOMER,
    payload: data,
  });
  export const setDepartement = data => ({
    type: Type.ADD_DEPARTEMENT,
    payload: data,
  });
  export const setManagerData = data => ({
    type: Type.REPORTING_MANAGER,
    payload: data,
  });
  export const setMonthlyAttendance = data => ({
    type: Type.MONTHLY_ATTENDANCE,
    payload: data,
  });
  export const setAllUserAttendance = data => ({
    type: Type.ALLU_USER_ATTENDANCE,
    payload: data,
  });
  export const setAllInvoice = data => ({
    type: Type.ALL_INVOICE,
    payload: data,
  });
  export const setAllInactiveEmployee = data => ({
    type: Type.ALL_INACTIVE_EMPLOYEE,
    payload: data,
  });
  export const setSwitchOnOff = data => ({
    type: Type.WEEK_ON_OFF,
    payload: data,
  });
  export const setWorkFromHome = data => ({
    type: Type.WORK_FROM_HOME,
    payload: data,
  });
  export const setGiftCardShow = data => ({
    type: Type.GIFT_CARD_SHOW,
    payload: data,
  });
  export const setLeaveWfhRequest = data => ({
    type: Type.LEAVE_WFH_REQUEST,
    payload: data,
  });