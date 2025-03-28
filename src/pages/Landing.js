import React from 'react'

function Landing() {
    return (
        <main>
            <div class="banner-setpath">
                <header id="header" class="site-header home-header home-header-while header-land ">
                    <div class="container">
                        <div class="row">
                            <div class="main-menu-wrapper">
                                <div class="menu-header">
                                    <a href="index.html" class="menu-logo">
                                        <img src="assets/img/logo.png" class="img-fluid" alt="Logo" />
                                    </a>
                                    <a id="menu_close" class="menu-close" href="javascript:void(0);">
                                        <i class="fas fa-times"></i>
                                    </a>
                                </div>
                                <ul class="main-nav bg-trans">
                                    <li>
                                        <a href="#features" class="active">Features</a>
                                    </li>
                                    <li>
                                        <a href="#pricing">Pricing</a>
                                    </li>
                                    <li>
                                        <a href="#reviews">Reviews</a>
                                    </li>

                                    <li>
                                        <a href="#contact">Contact us</a>
                                    </li>
                                </ul>
                                <div class="try-free link mobile-head-menu">
                                    <a class="btn btn-primary response-head-menu" href="https://themeforest.net/item/smarthr-bootstrap-admin-panel-template/21153150" target="_blank" role="button">Buy Now</a>
                                </div>
                            </div>
                            <div class="main-menu-head head3 d-flex justify-content-between border-0 pb-0">
                                <div class="res-center col-lg-3 col-sm-12 col-12">
                                    <div class="site">
                                        <a id="mobile_btn" href="javascript:void(0);">
                                            <span class="bar-icon-second">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </span>
                                        </a>
                                        <div class="site-brand">
                                            <a href="index.html" class="site-branding-logo"><img src="assets/img/logo.png" alt="logo" class="img-fluid" /></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="menu-list">
                                    <div class="right-header d-flex justify-content-center">
                                        <nav class="land-menu land3">
                                            <ul>
                                                <li><a href="#features" class="scrollTo active">Features</a></li>
                                                <li><a href="#pricing" class="scrollTo">Pricing</a></li>
                                                <li><a href="#reviews" class="scrollTo">Reviews</a></li>
                                                <li><a href="#contact" class="scrollTo">Contact us</a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div class="home-buy-button">
                                    <div class="buy-btns">
                                        <a href="https://themeforest.net/item/smarthr-bootstrap-admin-panel-template/21153150" target="_blank" class="btn btn-buys">Buy Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div class="main-banner-section" data-aos="fade-up" data-aos-duration="2000">
                    <div class="container">
                        <div class="row">
                            <div class="homepage-section d-flex align-items-center p-0">
                                <div class="col-lg-5 col-sm-12 col-12">
                                    <div class="banner-content">
                                        <h2><strong>The Processes more</strong> important from <span class="sub-title">SmartHR</span> Here!</h2>
                                        <div class="banner-input">
                                            <h6>Get started for free</h6>
                                            <form method="post">
                                                <div class="row">
                                                    <div class="col-lg-8 col-sm-6 col-12 pe-lg-0">
                                                        <input type="text" class="formcontrol" placeholder="Enter your email address..." />
                                                    </div>
                                                    <div class="col-lg-4 col-sm-6 col-12">
                                                        <button class="btn btn-banner">Get Started</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-sm-7 col-12">
                                    <div class="main-sliders">
                                        <img src="assets/img/home3.png" alt="main-slider" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default Landing
