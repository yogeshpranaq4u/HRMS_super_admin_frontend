//Live DataBase  Base  URL

// export const BaseUrl = "https://hr.hrmsbycvinfotech.com/CV/public/api/"; //New Live Server

//Debug DataBase  Base  URL
export const BaseUrl =
  "https://development-hrms-services.cvinfotechserver.com/hrms_backend/public/api";

//   "https://development-hrmanagement.cvinfotechserver.com/CV/public/api/";

export const ImagePath =
  "https://hr.hrmsbycvinfotech.com/CV/storage/app/public/images/"; //New Live Server
// "https://development-hrmanagement.cvinfotechserver.com/CV/storage/app/public/images/"; //Development

export const Api = {
  //Admin Api End   Points
  LOGIN: "login", //done
  REGISTERCOMPANY: "companies", //done
  GETPLANS: "get_AllPlans", //done
  UPDATEDEMOSTATUS: "update_Status", //done
  DASHBOARD_STATS: "dashboard/stats",
  DASHBOARD_PLAN_SUMMARY: "dashboard/plan-purchase-summary",
  DASHBOARD_PENDING_DEMO_REQUEST: "dashboard/pending-demo-requests",
  DASHBOARD_RECENT_REGISTRATIONS: "dashboard/recent-registrations",
  DASHBOARD_PLAN_EXPIRE: "dashboard/near-expire-expired-companies",
  DASHBOARD_TRANSACTION: "dashboard/get-recent-transactions",//done
};
