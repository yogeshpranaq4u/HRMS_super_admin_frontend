import React from 'react'
import { Link } from 'react-router-dom'

function SideBar() {
    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-logo">
                <a href="index.html" className="logo logo-normal">
                    <img src="assets/img/logo.svg" alt="Logo" />
                </a>
                <a href="index.html" className="logo-small">
                    <img src="assets/img/logo-small.svg" alt="Logo" />
                </a>
                <a href="index.html" className="dark-logo">
                    <img src="assets/img/logo-white.svg" alt="Logo" />
                </a>
            </div>
            {/* <div className="modern-profile p-3 pb-0">
                <div className="text-center rounded bg-light p-3 mb-4 user-profile">
                    <div className="avatar avatar-lg online mb-3">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="Img" className="img-fluid rounded-circle" />
                    </div>
                    <h6 className="fs-12 fw-normal mb-1">Adrian Herman</h6>
                    <p className="fs-10">System Admin</p>
                </div>
                <div className="sidebar-nav mb-3">
                    <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
                        role="tablist">
                        <li className="nav-item"><a className="nav-link active border-0" href="#">Menu</a></li>
                        <li className="nav-item"><a className="nav-link border-0" href="chat.html">Chats</a></li>
                        <li className="nav-item"><a className="nav-link border-0" href="email.html">Inbox</a></li>
                    </ul>
                </div>
            </div>
            <div className="sidebar-header p-3 pb-0 pt-2">
                <div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
                    <div className="avatar avatar-md onlin">
                        <img src="assets/img/profiles/avatar-02.jpg" alt="Img" className="img-fluid rounded-circle" />
                    </div>
                    <div className="text-start sidebar-profile-info ms-2">
                        <h6 className="fs-12 fw-normal mb-1">Adrian Herman</h6>
                        <p className="fs-10">System Admin</p>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between menu-item mb-3">
                    <div className="me-3">
                        <a href="calendar.html" className="btn btn-menubar">
                            <i className="ti ti-layout-grid-remove"></i>
                        </a>
                    </div>
                    <div className="me-3">
                        <a href="chat.html" className="btn btn-menubar position-relative">
                            <i className="ti ti-brand-hipchat"></i>
                            <span className="badge bg-info rounded-pill d-flex align-items-center justify-content-center header-badge">5</span>
                        </a>
                    </div>
                    <div className="me-3 notification-item">
                        <a href="activity.html" className="btn btn-menubar position-relative me-1">
                            <i className="ti ti-bell"></i>
                            <span className="notification-status-dot"></span>
                        </a>
                    </div>
                    <div className="me-0">
                        <a href="email.html" className="btn btn-menubar">
                            <i className="ti ti-message"></i>
                        </a>
                    </div>
                </div>
            </div> */}
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li className="menu-title"><span>Super Admin</span></li>
                        <li>
                            <ul>
                                <li className="submenu">
                                    <Link to="#">
                                        <i className="ti ti-smart-home"></i><span>Dashboard</span>
                                    </Link>
                                </li>
                                <li className="submenu">
                                    <Link to="#">
                                        <i className="ti ti-layout-grid-add"></i>
                                        <span>Companies</span>
                                        {/* <span className="menu-arrow"></span> */}
                                    </Link>
                                </li>
                                <li className="submenu">
                                    <Link to="#" className="active subdrop">
                                        <i className="ti ti-user-star"></i>
                                        <span>Subscriptions</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SideBar
