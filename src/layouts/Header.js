import React from 'react'

function Header({handleTogel}) {
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    // console.log("details", details);
    return (
        <div className="header">
            <div className="main-header">
                {/* <div className="header-left">
                    <a href="index.html" className="logo">
                        <img src="assets/img/logoNew.png" alt="Logo" />
                    </a>
                   
                </div> */}

                <a  className="mobile_btn" onClick={()=>{handleTogel()}}>
                    <span className="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </a>

                <div className="header-user">
                    <div className="nav user-menu nav-list">

                        <div className="me-auto d-flex align-items-center" id="header-search">
                            <a id="toggle_btn" href="javascript:void(0);" className="btn btn-menubar me-1">
                                <i className="ti ti-arrow-bar-to-left"></i>
                            </a>
                        </div>
                        <div className="sidebar sidebar-horizontal" id="horizontal-single">
                            <div className="sidebar-menu">
                                <div className="main-menu">
                                    <ul className="nav-menu">
                                        <li className="menu-title">
                                            <span>Main</span>
                                        </li>
                                        <li className="submenu">
                                            <a href="#">
                                                <i className="ti ti-smart-home"></i><span>Dashboard</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li><a href="index.html">Admin Dashboard</a></li>
                                                <li><a href="employee-dashboard.html">Employee Dashboard</a></li>
                                                <li><a href="deals-dashboard.html">Deals Dashboard</a></li>
                                                <li><a href="leads-dashboard.html">Leads Dashboard</a></li>
                                            </ul>
                                        </li>
                                        <li className="submenu">
                                            <a href="#" className="active">
                                                <i className="ti ti-user-star"></i><span>Super Admin</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li><a href="dashboard.html" className="active">Dashboard</a></li>
                                                <li><a href="companies.html">Companies</a></li>
                                                <li><a href="subscription.html">Subscriptions</a></li>
                                                <li><a href="packages.html">Packages</a></li>
                                                <li><a href="domain.html">Domain</a></li>
                                                <li><a href="purchase-transaction.html">Purchase Transaction</a></li>
                                            </ul>
                                        </li>
                                        <li className="submenu">
                                            <a href="#">
                                                <i className="ti ti-layout-grid-add"></i><span>Applications</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li><a href="chat.html">Chat</a></li>
                                                <li className="submenu submenu-two">
                                                    <a href="call.html">Calls<span
                                                        className="menu-arrow inside-submenu"></span></a>
                                                    <ul>
                                                        <li><a href="voice-call.html">Voice Call</a></li>
                                                        <li><a href="video-call.html">Video Call</a></li>
                                                        <li><a href="outgoing-call.html">Outgoing Call</a></li>
                                                        <li><a href="incoming-call.html">Incoming Call</a></li>
                                                        <li><a href="call-history.html">Call History</a></li>
                                                    </ul>
                                                </li>
                                                <li><a href="calendar.html">Calendar</a></li>
                                                <li><a href="email.html">Email</a></li>
                                                <li><a href="todo.html">To Do</a></li>
                                                <li><a href="notes.html">Notes</a></li>
                                                <li><a href="file-manager.html">File Manager</a></li>
                                                <li><a href="kanban-view.html">Kanban</a></li>
                                                <li><a href="invoices.html">Invoices</a></li>
                                            </ul>
                                        </li>
                                        <li className="submenu">
                                            <a href="#">
                                                <i className="ti ti-layout-board-split"></i><span>Layouts</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li>
                                                    <a href="layout-horizontal.html">
                                                        <span>Horizontal</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-detached.html">
                                                        <span>Detached</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-modern.html">
                                                        <span>Modern</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-two-column.html">
                                                        <span>Two Column </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-hovered.html">
                                                        <span>Hovered</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-box.html">
                                                        <span>Boxed</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-horizontal-single.html">
                                                        <span>Horizontal Single</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-horizontal-overlay.html">
                                                        <span>Horizontal Overlay</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-horizontal-box.html">
                                                        <span>Horizontal Box</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-horizontal-sidemenu.html">
                                                        <span>Menu Aside</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-vertical-transparent.html">
                                                        <span>Transparent</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-without-header.html">
                                                        <span>Without Header</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-rtl.html">
                                                        <span>RTL</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="layout-dark.html">
                                                        <span>Dark</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="submenu">
                                            <a href="#">
                                                <i className="ti ti-user-star"></i><span>Projects</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li>
                                                    <a href="clients-grid.html"><span>Clients</span>
                                                    </a>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Projects</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="projects-grid.html">Projects</a></li>
                                                        <li><a href="tasks.html">Tasks</a></li>
                                                        <li><a href="task-board.html">Task Board</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="call.html">Crm<span
                                                        className="menu-arrow"></span></a>
                                                    <ul>
                                                        <li><a href="contacts-grid.html"><span>Contacts</span></a></li>
                                                        <li><a href="companies-grid.html"><span>Companies</span></a></li>
                                                        <li><a href="deals-grid.html"><span>Deals</span></a></li>
                                                        <li><a href="leads-grid.html"><span>Leads</span></a></li>
                                                        <li><a href="pipeline.html"><span>Pipeline</span></a></li>
                                                        <li><a href="analytics.html"><span>Analytics</span></a></li>
                                                        <li><a href="activity.html"><span>Activities</span></a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Employees</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="employees.html">Employee Lists</a></li>
                                                        <li><a href="employees-grid.html">Employee Grid</a></li>
                                                        <li><a href="employee-details.html">Employee Details</a></li>
                                                        <li><a href="departments.html">Departments</a></li>
                                                        <li><a href="designations.html">Designations</a></li>
                                                        <li><a href="policy.html">Policies</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Tickets</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="tickets.html">Tickets</a></li>
                                                        <li><a href="ticket-details.html">Ticket Details</a></li>
                                                    </ul>
                                                </li>
                                                <li><a href="holidays.html"><span>Holidays</span></a></li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Attendance</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Leaves<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="leaves.html">Leaves (Admin)</a></li>
                                                                <li><a href="leaves-employee.html">Leave (Employee)</a></li>
                                                                <li><a href="leave-settings.html">Leave Settings</a></li>
                                                            </ul>
                                                        </li>
                                                        <li><a href="attendance-admin.html">Attendance (Admin)</a></li>
                                                        <li><a href="attendance-employee.html">Attendance (Employee)</a></li>
                                                        <li><a href="timesheets.html">Timesheets</a></li>
                                                        <li><a href="schedule-timing.html">Shift & Schedule</a></li>
                                                        <li><a href="overtime.html">Overtime</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Performance</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="performance-indicator.html">Performance Indicator</a></li>
                                                        <li><a href="performance-review.html">Performance Review</a></li>
                                                        <li><a href="performance-appraisal.html">Performance Appraisal</a></li>
                                                        <li><a href="goal-tracking.html">Goal List</a></li>
                                                        <li><a href="goal-type.html">Goal Type</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Training</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="training.html">Training List</a></li>
                                                        <li><a href="trainers.html">Trainers</a></li>
                                                        <li><a href="training-type.html">Training Type</a></li>
                                                    </ul>
                                                </li>
                                                <li><a href="promotion.html"><span>Promotion</span></a></li>
                                                <li><a href="resignation.html"><span>Resignation</span></a></li>
                                                <li><a href="termination.html"><span>Termination</span></a></li>
                                            </ul>
                                        </li>
                                        <li className="submenu">
                                            <a href="#">
                                                <i className="ti ti-user-star"></i><span>Administration</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Sales</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="estimates.html">Estimates</a></li>
                                                        <li><a href="invoices.html">Invoices</a></li>
                                                        <li><a href="payments.html">Payments</a></li>
                                                        <li><a href="expenses.html">Expenses</a></li>
                                                        <li><a href="provident-fund.html">Provident Fund</a></li>
                                                        <li><a href="taxes.html">Taxes</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Accounting</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="categories.html">Categories</a></li>
                                                        <li><a href="budgets.html">Budgets</a></li>
                                                        <li><a href="budget-expenses.html">Budget Expenses</a></li>
                                                        <li><a href="budget-revenues.html">Budget Revenues</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Payroll</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="employee-salary.html">Employee Salary</a></li>
                                                        <li><a href="payslip.html">Payslip</a></li>
                                                        <li><a href="payroll.html">Payroll Items</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Assets</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="assets.html">Assets</a></li>
                                                        <li><a href="asset-categories.html">Asset Categories</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Help & Supports</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="knowledgebase.html">Knowledge Base</a></li>
                                                        <li><a href="activity.html">Activities</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>User Management</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="users.html">Users</a></li>
                                                        <li><a href="roles-permissions.html">Roles & Permissions</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Reports</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li><a href="expenses-report.html">Expense Report</a></li>
                                                        <li><a href="invoice-report.html">Invoice Report</a></li>
                                                        <li><a href="payment-report.html">Payment Report</a></li>
                                                        <li><a href="project-report.html">Project Report</a></li>
                                                        <li><a href="task-report.html">Task Report</a></li>
                                                        <li><a href="user-report.html">User Report</a></li>
                                                        <li><a href="employee-report.html">Employee Report</a></li>
                                                        <li><a href="payslip-report.html">Payslip Report</a></li>
                                                        <li><a href="attendance-report.html">Attendance Report</a></li>
                                                        <li><a href="leave-report.html">Leave Report</a></li>
                                                        <li><a href="daily-report.html">Daily Report</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Settings</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">General Settings<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="profile-settings.html">Profile</a></li>
                                                                <li><a href="security-settings.html">Security</a></li>
                                                                <li><a href="notification-settings.html">Notifications</a></li>
                                                                <li><a href="connected-apps.html">Connected Apps</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Website Settings<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="bussiness-settings.html">Business Settings</a></li>
                                                                <li><a href="seo-settings.html">SEO Settings</a></li>
                                                                <li><a href="localization-settings.html">Localization</a></li>
                                                                <li><a href="prefixes.html">Prefixes</a></li>
                                                                <li><a href="preferences.html">Preferences</a></li>
                                                                <li><a href="performance-appraisal.html">Appearance</a></li>
                                                                <li><a href="language.html">Language</a></li>
                                                                <li><a href="authentication-settings.html">Authentication</a></li>
                                                                <li><a href="ai-settings.html">AI Settings</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">App Settings<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="salary-settings.html">Salary Settings</a></li>
                                                                <li><a href="approval-settings.html">Approval Settings</a></li>
                                                                <li><a href="invoice-settings.html">Invoice Settings</a></li>
                                                                <li><a href="leave-type.html">Leave Type</a></li>
                                                                <li><a href="custom-fields.html">Custom Fields</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">System Settings<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="email-settings.html">Email Settings</a></li>
                                                                <li><a href="email-template.html">Email Templates</a></li>
                                                                <li><a href="sms-settings.html">SMS Settings</a></li>
                                                                <li><a href="sms-template.html">SMS Templates</a></li>
                                                                <li><a href="otp-settings.html">OTP</a></li>
                                                                <li><a href="gdpr.html">GDPR Cookies</a></li>
                                                                <li><a href="maintenance-mode.html">Maintenance Mode</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Financial Settings<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="payment-gateways.html">Payment Gateways</a></li>
                                                                <li><a href="tax-rates.html">Tax Rate</a></li>
                                                                <li><a href="currencies.html">Currencies</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Other Settings<span
                                                                className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="custom-css.html">Custom CSS</a></li>
                                                                <li><a href="custom-js.html">Custom JS</a></li>
                                                                <li><a href="cronjob.html">Cronjob</a></li>
                                                                <li><a href="storage-settings.html">Storage</a></li>
                                                                <li><a href="ban-ip-address.html">Ban IP Address</a></li>
                                                                <li><a href="backup.html">Backup</a></li>
                                                                <li><a href="clear-cache.html">Clear Cache</a></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="submenu">
                                            <a href="#">
                                                <i className="ti ti-page-break"></i><span>Pages</span>
                                                <span className="menu-arrow"></span>
                                            </a>
                                            <ul>
                                                <li><a href="starter.html"><span>Starter</span></a></li>
                                                <li><a href="profile.html"><span>Profile</span></a></li>
                                                <li><a href="gallery.html"><span>Gallery</span></a></li>
                                                <li><a href="search-result.html"><span>Search Results</span></a></li>
                                                <li><a href="timeline.html"><span>Timeline</span></a></li>
                                                <li><a href="pricing.html"><span>Pricing</span></a></li>
                                                <li><a href="coming-soon.html"><span>Coming Soon</span></a></li>
                                                <li><a href="under-maintenance.html"><span>Under Maintenance</span></a></li>
                                                <li><a href="under-construction.html"><span>Under Construction</span></a></li>
                                                <li><a href="api-keys.html"><span>API Keys</span></a></li>
                                                <li><a href="privacy-policy.html"><span>Privacy Policy</span></a></li>
                                                <li><a href="terms-condition.html"><span>Terms & Conditions</span></a></li>
                                                <li className="submenu">
                                                    <a href="#"><span>Content</span> <span className="menu-arrow"></span></a>
                                                    <ul>
                                                        <li><a href="pages.html">Pages</a></li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Blogs<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="blogs.html">All Blogs</a></li>
                                                                <li><a href="blog-categories.html">Categories</a></li>
                                                                <li><a href="blog-comments.html">Comments</a></li>
                                                                <li><a href="blog-tags.html">Tags</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Locations<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="countries.html">Countries</a></li>
                                                                <li><a href="states.html">States</a></li>
                                                                <li><a href="cities.html">Cities</a></li>
                                                            </ul>
                                                        </li>
                                                        <li><a href="testimonials.html">Testimonials</a></li>
                                                        <li><a href="faq.html">FAQ’S</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="#">
                                                        <span>Authentication</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);" className="">Login<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="login.html">Cover</a></li>
                                                                <li><a href="login-2.html">Illustration</a></li>
                                                                <li><a href="login-3.html">Basic</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);" className="">Register<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="register.html">Cover</a></li>
                                                                <li><a href="register-2.html">Illustration</a></li>
                                                                <li><a href="register-3.html">Basic</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu"><a href="javascript:void(0);">Forgot Password<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="forgot-password.html">Cover</a></li>
                                                                <li><a href="forgot-password-2.html">Illustration</a></li>
                                                                <li><a href="forgot-password-3.html">Basic</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Reset Password<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="reset-password.html">Cover</a></li>
                                                                <li><a href="reset-password-2.html">Illustration</a></li>
                                                                <li><a href="reset-password-3.html">Basic</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">Email Verification<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="email-verification.html">Cover</a></li>
                                                                <li><a href="email-verification-2.html">Illustration</a></li>
                                                                <li><a href="email-verification-3.html">Basic</a></li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">2 Step Verification<span className="menu-arrow"></span></a>
                                                            <ul>
                                                                <li><a href="two-step-verification.html">Cover</a></li>
                                                                <li><a href="two-step-verification-2.html">Illustration</a></li>
                                                                <li><a href="two-step-verification-3.html">Basic</a></li>
                                                            </ul>
                                                        </li>
                                                        <li><a href="lock-screen.html">Lock Screen</a></li>
                                                        <li><a href="error-404.html">404 Error</a></li>
                                                        <li><a href="error-500.html">500 Error</a></li>
                                                    </ul>
                                                </li>
                                                <li className="submenu">
                                                    <a href="#">
                                                        <span>UI Interface</span>
                                                        <span className="menu-arrow"></span>
                                                    </a>
                                                    <ul>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-hierarchy-2"></i>
                                                                <span>Base UI</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li>
                                                                    <a href="ui-alerts.html">Alerts</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-accordion.html">Accordion</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-avatar.html">Avatar</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-badges.html">Badges</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-borders.html">Border</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-buttons.html">Buttons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-buttons-group.html">Button Group</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-breadcrumb.html">Breadcrumb</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-cards.html">Card</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-carousel.html">Carousel</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-colors.html">Colors</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-dropdowns.html">Dropdowns</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-grid.html">Grid</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-images.html">Images</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-lightbox.html">Lightbox</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-media.html">Media</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-modals.html">Modals</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-offcanvas.html">Offcanvas</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-pagination.html">Pagination</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-popovers.html">Popovers</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-progress.html">Progress</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-placeholders.html">Placeholders</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-spinner.html">Spinner</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-sweetalerts.html">Sweet Alerts</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-nav-tabs.html">Tabs</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-toasts.html">Toasts</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-tooltips.html">Tooltips</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-typography.html">Typography</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-video.html">Video</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-sortable.html">Sortable</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-swiperjs.html">Swiperjs</a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-hierarchy-3"></i>
                                                                <span>Advanced UI</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li>
                                                                    <a href="ui-ribbon.html">Ribbon</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-clipboard.html">Clipboard</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-drag-drop.html">Drag & Drop</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-rangeslider.html">Range Slider</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-rating.html">Rating</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-text-editor.html">Text Editor</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-counter.html">Counter</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-scrollbar.html">Scrollbar</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-stickynote.html">Sticky Note</a>
                                                                </li>
                                                                <li>
                                                                    <a href="ui-timeline.html">Timeline</a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-input-search"></i>
                                                                <span>Forms</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li className="submenu submenu-two">
                                                                    <a href="javascript:void(0);">Form Elements <span className="menu-arrow inside-submenu"></span>
                                                                    </a>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="form-basic-inputs.html">Basic Inputs</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-checkbox-radios.html">Checkbox & Radios</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-input-groups.html">Input Groups</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-grid-gutters.html">Grid & Gutters</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-select.html">Form Select</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-mask.html">Input Masks</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-fileupload.html">File Uploads</a>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                                <li className="submenu submenu-two">
                                                                    <a href="javascript:void(0);">Layouts <span className="menu-arrow inside-submenu"></span>
                                                                    </a>
                                                                    <ul>
                                                                        <li>
                                                                            <a href="form-horizontal.html">Horizontal Form</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-vertical.html">Vertical Form</a>
                                                                        </li>
                                                                        <li>
                                                                            <a href="form-floating-labels.html">Floating Labels</a>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                                <li>
                                                                    <a href="form-validation.html">Form Validation</a>
                                                                </li>

                                                                <li>
                                                                    <a href="form-select2.html">Select2</a>
                                                                </li>
                                                                <li>
                                                                    <a href="form-wizard.html">Form Wizard</a>
                                                                </li>
                                                                <li>
                                                                    <a href="form-pickers.html">Form Pickers</a>
                                                                </li>

                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-table-plus"></i>
                                                                <span>Tables</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li>
                                                                    <a href="tables-basic.html">Basic Tables </a>
                                                                </li>
                                                                <li>
                                                                    <a href="data-tables.html">Data Table </a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-chart-line"></i>
                                                                <span>Charts</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li>
                                                                    <a href="chart-apex.html">Apex Charts</a>
                                                                </li>
                                                                <li>
                                                                    <a href="chart-c3.html">Chart C3</a>
                                                                </li>
                                                                <li>
                                                                    <a href="chart-js.html">Chart Js</a>
                                                                </li>
                                                                <li>
                                                                    <a href="chart-morris.html">Morris Charts</a>
                                                                </li>
                                                                <li>
                                                                    <a href="chart-flot.html">Flot Charts</a>
                                                                </li>
                                                                <li>
                                                                    <a href="chart-peity.html">Peity Charts</a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-icons"></i>
                                                                <span>Icons</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li>
                                                                    <a href="icon-fontawesome.html">Fontawesome Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-tabler.html">Tabler Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-bootstrap.html">Bootstrap Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-remix.html">Remix Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-feather.html">Feather Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-ionic.html">Ionic Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-material.html">Material Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-pe7.html">Pe7 Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-simpleline.html">Simpleline Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-themify.html">Themify Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-weather.html">Weather Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-typicon.html">Typicon Icons</a>
                                                                </li>
                                                                <li>
                                                                    <a href="icon-flag.html">Flag Icons</a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li className="submenu">
                                                            <a href="javascript:void(0);">
                                                                <i className="ti ti-table-plus"></i>
                                                                <span>Maps</span>
                                                                <span className="menu-arrow"></span>
                                                            </a>
                                                            <ul>
                                                                <li>
                                                                    <a href="maps-vector.html">Vector</a>
                                                                </li>
                                                                <li>
                                                                    <a href="maps-leaflet.html">Leaflet</a>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li><a href="#">Documentation</a></li>
                                                <li><a href="#">Change Log</a></li>
                                                <li className="submenu">
                                                    <a href="javascript:void(0);"><span>Multi Level</span><span className="menu-arrow"></span></a>
                                                    <ul>
                                                        <li><a href="javascript:void(0);">Multilevel 1</a></li>
                                                        <li className="submenu submenu-two">
                                                            <a href="javascript:void(0);">Multilevel 2<span
                                                                className="menu-arrow inside-submenu"></span></a>
                                                            <ul>
                                                                <li><a href="javascript:void(0);">Multilevel 2.1</a></li>
                                                                <li className="submenu submenu-two submenu-three">
                                                                    <a href="javascript:void(0);">Multilevel 2.2<span
                                                                        className="menu-arrow inside-submenu inside-submenu-two"></span></a>
                                                                    <ul>
                                                                        <li><a href="javascript:void(0);">Multilevel 2.2.1</a></li>
                                                                        <li><a href="javascript:void(0);">Multilevel 2.2.2</a></li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                        <li><a href="javascript:void(0);">Multilevel 3</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>


                        <div className="d-flex align-items-center">
                            <div className="me-1 notification_item">
                                <a href="#" className="btn btn-menubar position-relative me-1" id="notification_popup"
                                    data-bs-toggle="dropdown">
                                    <i className="ti ti-bell"></i>
                                    <span className="notification-status-dot"></span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end notification-dropdown p-4">
                                    <div className="d-flex align-items-center justify-content-between border-bottom p-0 pb-3 mb-3">
                                        <h4 className="notification-title">Notifications (2)</h4>
                                        <div className="d-flex align-items-center">
                                            <a href="#" className="text-primary fs-15 me-3 lh-1">Mark all as read</a>
                                            <div className="dropdown">
                                                <a href="javascript:void(0);" className="bg-white dropdown-toggle"
                                                    data-bs-toggle="dropdown">
                                                    <i className="ti ti-calendar-due me-1"></i>Today
                                                </a>
                                                <ul className="dropdown-menu mt-2 p-3">
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">
                                                            This Week
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">
                                                            Last Week
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">
                                                            Last Month
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="noti-content">
                                        <div className="d-flex flex-column">
                                            <div className="border-bottom mb-3 pb-3">
                                                <a href="activity.html">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-lg me-2 flex-shrink-0">
                                                            <img src="assets/img/profiles/avatar-27.jpg" alt="Profile" />
                                                        </span>
                                                        <div className="flex-grow-1">
                                                            <p className="mb-1"><span
                                                                className="text-dark fw-semibold">Shawn</span>
                                                                performance in Math is below the threshold.</p>
                                                            <span>Just Now</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="border-bottom mb-3 pb-3">
                                                <a href="activity.html" className="pb-0">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-lg me-2 flex-shrink-0">
                                                            <img src="assets/img/profiles/avatar-23.jpg" alt="Profile" />
                                                        </span>
                                                        <div className="flex-grow-1">
                                                            <p className="mb-1"><span
                                                                className="text-dark fw-semibold">Sylvia</span> added
                                                                appointment on 02:00 PM</p>
                                                            <span>10 mins ago</span>
                                                            <div
                                                                className="d-flex justify-content-start align-items-center mt-1">
                                                                <span className="btn btn-light btn-sm me-2">Deny</span>
                                                                <span className="btn btn-primary btn-sm">Approve</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="border-bottom mb-3 pb-3">
                                                <a href="activity.html">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-lg me-2 flex-shrink-0">
                                                            <img src="assets/img/profiles/avatar-25.jpg" />
                                                        </span>
                                                        <div className="flex-grow-1">
                                                            <p className="mb-1">New student record <span className="text-dark fw-semibold"> George</span>
                                                                is created by <span className="text-dark fw-semibold">Teressa</span>
                                                            </p>
                                                            <span>2 hrs ago</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="border-0 mb-3 pb-0">
                                                <a href="activity.html">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-lg me-2 flex-shrink-0">
                                                            <img src="assets/img/profiles/avatar-01.jpg" alt="Profile" />
                                                        </span>
                                                        <div className="flex-grow-1">
                                                            <p className="mb-1">A new teacher record for <span className="text-dark fw-semibold">Elisa</span> </p>
                                                            <span>09:45 AM</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex p-0">
                                        <a href="#" className="btn btn-light w-100 me-2">Cancel</a>
                                        <a href="activity.html" className="btn btn-primary w-100">View All</a>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown profile-dropdown">
                                <a href="javascript:void(0);" className="dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                                    <span className="avatar avatar-sm online">
                                        <img src="assets/img/profiles/avatar-12.jpg" alt="Img" className="img-fluid rounded-circle" />
                                    </span>
                                </a>
                                <div className="dropdown-menu shadow-none">
                                    <div className="card mb-0">
                                        <div className="card-header">
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-lg me-2 avatar-rounded">
                                                    <img src="assets/img/profiles/avatar-12.jpg" alt="img" />
                                                </span>
                                                <div>
                                                    <h5 className="mb-0">Kevin Larry</h5>
                                                    <p className="fs-12 fw-medium mb-0">warren@example.com</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <a className="dropdown-item d-inline-flex align-items-center p-0 py-2"
                                                href="profile.html">
                                                <i className="ti ti-user-circle me-1"></i>My Profile
                                            </a>
                                            <a className="dropdown-item d-inline-flex align-items-center p-0 py-2" href="bussiness-settings.html">
                                                <i className="ti ti-settings me-1"></i>Settings
                                            </a>

                                            <a className="dropdown-item d-inline-flex align-items-center p-0 py-2"
                                                href="profile-settings.html">
                                                <i className="ti ti-circle-arrow-up me-1"></i>My Account
                                            </a>
                                            <a className="dropdown-item d-inline-flex align-items-center p-0 py-2" href="knowledgebase.html">
                                                <i className="ti ti-question-mark me-1"></i>Knowledge Base
                                            </a>
                                        </div>
                                        <div className="card-footer py-1">
                                            <a className="dropdown-item d-inline-flex align-items-center p-0 py-2" 
                                            onClick={()=>{
                                                sessionStorage.clear()
                                                window.location = "/login"                                            }}
                                            ><i className="ti ti-login me-2"></i>Logout</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="dropdown mobile-user-menu">
                    <a href="javascript:void(0);" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-ellipsis-v"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="profile.html">My Profile</a>
                        <a className="dropdown-item" href="profile-settings.html">Settings</a>
                        <a className="dropdown-item" href="login.html">Logout</a>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Header
