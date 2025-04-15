import React from 'react'

function Header({handleTogel}) {
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}

    return (
        <div className="header">
            <div className="main-header">
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
                        <div className="d-flex align-items-center">
                            <div className="dropdown profile-dropdown">
                                <a  className="dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                                    <span className="avatar avatar-sm online">
                                    <i className='ti ti-user fs-20 text-dark rounded-full border' />
                                        {/* <img src="/assets/img/profiles/avatar-12.jpg" alt="Img" className="img-fluid rounded-circle" /> */}
                                    </span>
                                </a>
                                <div className="dropdown-menu shadow-none">
                                    <div className="card mb-0">
                                        <div className="card-header">
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-lg me-2 avatar-rounded">
                                                    <i className='ti ti-user fs-26' />
                                                    {/* <img src="/assets/img/profiles/avatar-12.jpg" alt="img" /> */}
                                                </span>
                                                <div>
                                                    <h5 className="mb-0">{details?.user?.name}</h5>
                                                    <p className="fs-12 fw-medium mb-0">{details?.user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <a className="dropdown-item d-inline-flex align-items-center p-0 py-2"
                                                href="#">
                                                <i className="ti ti-user-circle me-1"></i>My Profile
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
            </div>

        </div>
    )
}

export default Header
