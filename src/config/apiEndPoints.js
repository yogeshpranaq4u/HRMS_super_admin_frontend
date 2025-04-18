
//Debug api  Base  URL
export const BaseUrl = "https://development-hrms-services-2.cvinfotechserver.com/public/api"
export const ImagePath =
  "https://development-hrms-services-2.cvinfotechserver.com/public/"; //New Live Server

export const Api = {
  //Admin Api End   Points
  LOGIN: "/super-admin/login", 
  DEMOSTATS: "super-admin/request-demo/stats", 
  PLANSSTATS: "super-admin/companies/plans/stats", 
  COMPANIESSTATS: "super-admin/companies/stats", 
  VERIFYOTP: "/super-admin/verify-otp", 
  RESEND: "super-admin/resend-otp", 
  REGISTERCOMPANY: "super-admin/companies", 
  GETPLANS: "super-admin/plans", 
  GETREQUESTDEMO:  "super-admin/request-demo", 
  GETCOMPANIES:  "super-admin/companies", 
  // UPDATEDEMOSTATUS: "super-admin/update-Status", 
  UPDATEDEMOSTATUS: "super-admin/request-demo", 
  DASHBOARD_STATS: "super-admin/dashboard/stats",
  DASHBOARD_PLAN_SUMMARY: "super-admin/dashboard/plan-purchase-summary",
  DASHBOARD_PENDING_DEMO_REQUEST: "super-admin/dashboard/pending-demo-requests",
  DASHBOARD_RECENT_REGISTRATIONS: "super-admin/dashboard/recent-registrations",
  DASHBOARD_PLAN_EXPIRE: "super-admin/dashboard/near-expire-expired-companies",
  DASHBOARD_TRANSACTION: "super-admin/dashboard/get-recent-transactions",//done
};
