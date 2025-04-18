//Live DataBase  Base  URL


//Debug DataBase  Base  URL
export const API_BASE_URL = 
// "https://hr.hrmsbycvinfotech.com/CV/public/api/"; //New Live Server

"https://development-hrmanagement.cvinfotechserver.com/CV/public/api/"; //DevelopMent

// export const BaseUrl = "https://hr.hrmsbycvinfotech.com/CV/public/api/"; //New Live Server

//Debug DataBase  Base  URL
export const BaseUrl =
  "https://development-hrmanagement.cvinfotechserver.com/CV/public/api/";

export const ImagePath =
  "https://hr.hrmsbycvinfotech.com/CV/storage/app/public/images/"; //New Live Server
// "https://development-hrmanagement.cvinfotechserver.com/CV/storage/app/public/images/"; //Development

export const ImagePath1 =
  "https://hr.hrmsbycvinfotech.com/CV/storage/app/public/attendance_image/"; //New Live Server
// "https://development-hrmanagement.cvinfotechserver.com/CV/storage/app/public/attendance_image/"; //development

export const Api = {
  //Admin Api End   Points
  LOGIN: "login", //done
  ADD_EMPLOYEE_DETAILS: "add_employee", //done
  GET_EMPLOYEE: "get_users", //done
  DELETE_EMPLOYEE: "delete_employee", //done
  UPDATE_EMPLOYEE_DETAILS: "update_employee", //done
  ADD_LEAVE: "add_leave", //done
  GET_EMPLOYEE_LEAVE_DETAILS: "get_user_leave_data", //done
  UPDATE_EMPLOYEE_LEAVE: "update_add_leave", //done
  GET_ATTENDANCE: "get_attndance",
  GET_USER_ATTENDANCE: "get_user_attndance",
  ADD_HOLIDAY: "add_holidays",
  ADD_REPORTING_MANAGER: "add_reporting_managers",
  ADD_DEPARTMENT: "add_departments",
  GET_ROPORTING_MANAGER: "get_reporting_managers",
  GET_DEPARTMENT: "get_departments",
  DELETE_DEPARTMENT: "delete_departments",
  DELETE_REPORT_MANAGER: "delete_reporting_managers",
  UPLOAD_PROFILE_IMAGE: "update_employee_image",
  ADMIN_UPDATE_PASSWORD: "update_password",
  GET_ADMIN: "get_admin",
  SALARY_CALCULATION: "salary_calculation",
  ALL_USERS: "getall_users",
  ADD_STOCK: "add_stock",
  GET_STOCK: "get_stock",
  ADD_WFH: "add_wfh",
  // DELETE_ASSETS: "delete_assets",
  UPDATE_STOCKS: "update_stock",
  ADMIN_REMINDER: "reminderall",
  SALARY_SUBMIT: "salary_submit",
  GET_ALL_SALARY: "get_all_salary",
  GET_MONTHLY_ATTENDANCE: "get_monthly_attendance",
  ASSIGN_ASSETS: "assign_assets",
  GET_ASSIGN_ASSET: "get_assign_assets",
  UPDATE_ASSIGN_ASSETS: "update_assign_assets",
  ADD_CUSTOMER: "add_Customer",
  GET_CUSTOMER: "get_Customer",
  UPDATE_CUSTOMER: "update_Customer",
  CREATE_INVOICE: "create_invoice",
  GET_ALL_INVOICE: "getall_invoice",
  DOWNLOAD_INVOICE: "download_invoice",
  UPDATE_INVOICE: "update_invoice",
  PAYMENT_UPDATE: "payment_update",
  GET_ALL_INACTIVE_EMPLOYEE: "getall_inactive",
  GETWFH_DATA: "getwfh_data",
  DELETE_WFH: "delete_wfh",
  UPDATE_WHF: "update_wfh",
  VERFY_OTP: "otp_verify",
  RESEND_OTP: "resend_otp",
  GET_ALL_LEAVE_WFH_REQUEST: "get_all_request",
  APPROVE_LEAVE_REQ: "approve_leave_req",
  UNAPPROVE_LEAVE_REQ: "Unapproved_leave_req",
  GIVE_ACCESS: "give_access",
  DELETE_ACCESS: "delete_access",
  EDIT_ACCESS: "edit_access",
  LOG_OUT_WFHLOCATION: "logout_wfhlocation",
  LOGOUT_WFHLOCATION_IMAGE: "logout_wfhlocation_image",
  //Employee Api End Point,
  LOGOUT: "logout",
  GET_EMPLOYEE_PROFILE: "get_employee_profile",
  GET_HOLIDAY: "get_holidays",
  GET_EMPLOYEE_LEAVE: "get_employee_leave",
  GET_EMPLOYEE_ATTENDANCE: "get_employee_attendance",
  EMPLOYEE_ATTENDANCE_UPDATE: "update_attndance",
  GET_EMPLOYEE_SALARY: "get_employee_salary",
  GET_EMP_ASSIGN_ASSETS: "get_emp_assign_assets",
  ADD_EMP_LEAVEREQUEST: "add_emp_leaverequest",
  GET_EMP_LEAVEREQUEST: "get_emp_leaverequest",
  GET_EMP_ADMIN: "get_emp_admin",
  GET_EMP_USER: "get_emp_users",
  UPDATE_EMP_PASSWORD: "update_emp_password",
  GET_WFHLEAVE_DATA: "get_wfhLeave_data",
  LOGIN_WFH: "login_wfh",
  EMPLOYEE_LEAVEWFH_REQUESR_CANCEL: "cancel_req",
};
