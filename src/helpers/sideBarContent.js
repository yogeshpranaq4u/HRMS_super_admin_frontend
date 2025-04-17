export const sideBarContentSuperAdmin= [
    {
      title: "Dashboard",
      pathname: "/superadmin/",
      iconName: "ti ti-smart-home"

    },
    {
      title: "Companies",
      pathname: "/superadmin/company",
      iconName: "ti ti-building"

    },
    {
      title: "Demo",
      pathname: "/superadmin/demo-requests",
      iconName: "ti ti-screen-share"
    },
    {
      title: "Payments",
      // pathname: "/superadmin#",
      pathname: "/superadmin/plans",
      iconName: "ti ti-credit-card-pay"
    },
    {
      title: "Manage Policy",
      pathname: "/superadmin/manage-policy",
      iconName: "ti ti-shield-cog "
    },
    {
      title: "Admins",
      pathname: "/superadmin/admin-list",
      iconName: "ti ti-circle-dotted-letter-p"
    },
  ]

export const sideBarContentEmployee = [
    {
      title: "Profile",
      pathname: "/employee/",
      iconName: "ti ti-home" // 🏠 or your home icon class
    },
    {
      title: "Leaves/WFH",
      pathname: "/employee/leaves",
      iconName: "ti ti-calendar-x" // 🗓❌
    },
    {
      title: "Attendance",
      pathname: "/employee/attendance",
      iconName: "ti ti-users" // 👥
    },
    {
      title: "Salary",
      pathname: "/employee/salary",
      iconName: "ti ti-currency-dollar" // 💰
    },
    {
      title: "Holidays",
      pathname: "/employee/holidays",
      iconName: "ti ti-calendar" // 📅
    },
    {
      title: "Assets",
      pathname: "/employee/assets",
      iconName: "ti ti-device-laptop" // 💻
    },
    // {
    //   title: "Organisation Tree",
    //   pathname: "/employee/org-tree",
    //   iconName: "ti ti-hierarchy" // 🧬
    // },
    {
      title: "Update Password",
      pathname: "/employee/update-password",
      iconName: "ti ti-shield-lock" // 🔒
    },
    {
      title: "Log Out",
      pathname: "/employee/logout",
      iconName: "ti ti-logout" // 🔚
    }
  ];
export const sideBarContentAdmin = [
    {
      title: "DashBoard",
      pathname: "/admin/",
      iconName: "ti ti-home" // 🏠 or your home icon class
    },
    {
      title: "Employees",
      pathname: "/admin/employees",
      iconName: "ti ti-users" // 🏠 or your home icon class
    },
    {
      title: "Leaves/WFH",
      pathname: "/admin/leaves/requests",
      iconName: "ti ti-calendar-x" ,// 🗓❌
      paths:["/admin/leaves/requests","/admin/leaves/history"],
      subMenu:[
        {
          title: "Requests",
          pathname: "/admin/leaves/requests",
        },
        {
          title: "History",
          pathname: "/admin/leaves/history",
        }
      ]
    },
    {
      title: "Attendance",
      pathname: "/admin/attendance",
      iconName: "ti ti-file-time" // 👥
    },
    {
      title: "Salary",
      pathname: "/admin/salary",
      iconName: "ti ti-currency-dollar" // 💰
    },
    {
      title: "Holidays Calender",
      pathname: "/admin/holidays",
      iconName: "ti ti-calendar" // 📅
    },
    {
      title: "Reminder",
      pathname: "/admin/reminder",
      iconName: "ti ti-bell-ringing" // 📅
    },
    {
      title: "Manage Structure",
      pathname: "/admin/manage",
      iconName: "ti ti-settings-pin" // 💻
    },
    {
      title: "Assets Management",
      pathname: "/admin/assets",
      iconName: "ti ti-device-laptop" // 💻
    },
    {
      title: "Billing",
      pathname: "/admin/billing/customers",
      iconName: "ti ti-shopping-cart-dollar",
      paths:["/admin/billing/customers","/admin/billing/invoice"],

      subMenu:[
        {
          title: "Customers",
          pathname: "/admin/billing/customers",
          isAllow:true
        },
        {
          title: "Invoice",
          pathname: "/admin/billing/invoice",
          isAllow:true
        }
      ]
    },
    {
      title: "Profile",
      pathname: "/admin/profile",
      iconName: "ti ti-user-circle" // 💻
    },
    {
      title: "Update Password",
      pathname: "/admin/update-password",
      iconName: "ti ti-shield-lock" // 🔒
    },
    {
      title: "Log Out",
      pathname: "/admin/logout",
      iconName: "ti ti-logout" // 🔚
    }
  ];
  