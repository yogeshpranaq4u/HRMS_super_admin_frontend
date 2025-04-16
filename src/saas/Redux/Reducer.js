import Type from "../Redux/Constants";
const intialState = {
  getEmployeeDetails: [],
  getEmployeeAuth: false,
  getEmployeeLeaveDetails: [],
  getEmployeeAllDetails: [],
  getEmployeeindex: 0,
  getEmployeeHoliday: [],
  getAssetesData: [],
  getAssetsAssignData: [],
  getAssetIndex: 0,
  getCustomerDetails: [],
  getReportingManager: [],
  getDepartement: [],
  getMonthlyAttendance: [],
  getAllUserAttendance: [],
  getAllinvoice: [],
  getAllInactiveEmployee: [],
  getSwitchOnOff: false,
  getWorkFromHome: [],
  getGiftCardShow: false,
  getLeaveWfhRequest: [],
};
const EmployeeReduser = (state = intialState, action) => {
  switch (action.type) {
    case Type.EMPLOYEE_DETAILS:
      return { ...state, getEmployeeDetails: action.payload };
    case Type.EMPLOYEE_AUTH:
      return { ...state, getEmployeeAuth: action.payload };
    case Type.EMPLOYEE_LEAVE_DETAIL:
      return { ...state, getEmployeeLeaveDetails: action.payload };
    case Type.EMPLOYEE_ALL_DETAILS:
      return { ...state, getEmployeeAllDetails: action.payload };
    case Type.EMPLOYEE_SELECTED_INDEX:
      return { ...state, getEmployeeindex: action.payload };
    case Type.EMPLOYEE_HOLIDAY:
      return { ...state, getEmployeeHoliday: action.payload };
    case Type.ASSET_MANAGEMENT:
      return { ...state, getAssetesData: action.payload };
    case Type.ASSET_ASSIGN_MANAGEMENT:
      return { ...state, getAssetsAssignData: action.payload };
    case Type.ITEM_ASSET_HEADER_SELECT:
      return { ...state, getAssetIndex: action.payload };
    case Type.ADD_CUSTOMER:
      return { ...state, getCustomerDetails: action.payload };
    case Type.REPORTING_MANAGER:
      return { ...state, getReportingManager: action.payload };
    case Type.ADD_DEPARTEMENT:
      return { ...state, getDepartement: action.payload };
    case Type.MONTHLY_ATTENDANCE:
      return { ...state, getMonthlyAttendance: action.payload };
    case Type.ALLU_USER_ATTENDANCE:
      return { ...state, getAllUserAttendance: action.payload };
    case Type.ALL_INVOICE:
      return { ...state, getAllinvoice: action.payload };
    case Type.ALL_INACTIVE_EMPLOYEE:
      return { ...state, getAllInactiveEmployee: action.payload };
    case Type.WEEK_ON_OFF:
      return { ...state, getSwitchOnOff: action.payload };
    case Type.WORK_FROM_HOME:
      return { ...state, getWorkFromHome: action.payload };
    case Type.GIFT_CARD_SHOW:
      return { ...state, getGiftCardShow: action.payload };
      case Type.LEAVE_WFH_REQUEST:
        return { ...state, getLeaveWfhRequest: action.payload };
    default:
      return state;
  }
};
export default EmployeeReduser;
