
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
  REGISTERCOMPANY: "super-admin/companies", //done
  GETPLANS: "super-admin/plans", //done
  GETREQUESTDEMO:  "super-admin/request-demo", //done
  UPDATEDEMOSTATUS: "update_Status", //done
  DASHBOARD_STATS: "dashboard/stats",
  DASHBOARD_PLAN_SUMMARY: "dashboard/plan-purchase-summary",
  DASHBOARD_PENDING_DEMO_REQUEST: "dashboard/pending-demo-requests",
  DASHBOARD_RECENT_REGISTRATIONS: "dashboard/recent-registrations",
  DASHBOARD_PLAN_EXPIRE: "dashboard/near-expire-expired-companies",
  DASHBOARD_TRANSACTION: "dashboard/get-recent-transactions",//done
};
