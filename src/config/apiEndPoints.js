
//Debug api  Base  URL
export const BaseUrl = "https://development-hrms-services-2.cvinfotechserver.com/public/api"
  // "https://development-hrms-services.cvinfotechserver.com/hrms_backend/public/api";

export const ImagePath =
  "https://hr.hrmsbycvinfotech.com/CV/storage/app/public/images/"; //New Live Server
// "https://development-hrmanagement.cvinfotechserver.com/CV/storage/app/public/images/"; //Development

export const Api = {
  //Admin Api End   Points
  LOGIN: "/super-admin/login", //done
  VERIFYOTP: "/super-admin/verify-otp", //done
  RESEND: "super-admin/resend-otp", //done
  REGISTERCOMPANY: "super-admin/companies", //done
  GETPLANS: "super-admin/plans", //done
  GETREQUESTDEMO:  "super-admin/request-demo", //done
  GETCOMPANIES:  "super-admin/companies", //done
  UPDATEDEMOSTATUS: "super-admin/update-Status", //done
  DASHBOARD_STATS: "super-admin/dashboard/stats",
  DASHBOARD_PLAN_SUMMARY: "super-admin/dashboard/plan-purchase-summary",
  DASHBOARD_PENDING_DEMO_REQUEST: "super-admin/dashboard/pending-demo-requests",
  DASHBOARD_RECENT_REGISTRATIONS: "super-admin/dashboard/recent-registrations",
  DASHBOARD_PLAN_EXPIRE: "super-admin/dashboard/near-expire-expired-companies",
  DASHBOARD_TRANSACTION: "super-admin/dashboard/get-recent-transactions",//done
};
