import React from 'react'

function Header({ handleOpen }) {
    // console.log("handleOpen" ,setShow);

    return (
        <header id="header" className="site-header home-header home-header-while header-land">
            <div className="container">
                <div className="row">
                    <div className="main-menu-wrapper">
                        <div className="menu-header">
                            <a href="index.html" className="menu-logo">
                                <img src="assets/img/logo.png" className="img-fluid" alt="Logo" />
                            </a>
                            <a id="menu_close" className="menu-close" >
                                <i className="fas fa-times text-primary"></i>
                            </a>
                        </div>
                        <ul className="main-nav bg-trans">
                            <li>
                                <a href="#features">Features</a>
                            </li>
                            <li>
                                <a href="#pricing">Pricing</a>
                            </li>
                            <li>
                                <a href="#reviews">Reviews</a>
                            </li>
                            <li>
                                <a href="#blog">Blog</a>
                            </li>
                            <li>
                                <a href="#contact">Contact us</a>
                            </li>
                        </ul>
                        <div className="try-free link mobile-head-menu">
                            <button
                                onClick={() => {
                                    handleOpen(true)
                                }}
                                type='button' className="req-btn"  >
                                Request Demo →
                                {/* <i class="fas fa-arrow-right"></i> */}
                            </button>
                        </div>
                    </div>
                    <div className="main-menu-head d-flex justify-content-between">
                        <div className="res-center col-lg-3 col-sm-12 col-12">
                            <div className="site">
                                <a id="mobile_btn" href="javascript:void(0);">
                                    <span className="bar-icon-second text-primary">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                </a>
                                <div className="site-brand">
                                    <a href="/" className="site-branding-logo"><img src="assets/img/logo.png" alt="logo" className="img-fluid" /></a>
                                </div>
                            </div>
                        </div>
                        <div className="menu-list">
                            <div className="right-header d-flex justify-content-center">
                                <nav className="land-menu">
                                    <ul>
                                        <li><a href="#features" className="scrollTo">Features</a></li>
                                        <li><a href="#pricing" className="scrollTo">Pricing</a></li>
                                        <li><a href="#news" className="scrollTo">News</a></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="home-buy-button">
                            <div className="buy-btns">
                                <button onClick={() => {
                                    handleOpen()

                                }} className='req-btn'>
                                    Request Demo →
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
