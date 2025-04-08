import React from 'react'

function Pricing() {
    return (
        <div className="features-choose-sections" id="pricing">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-12">
                        <div className="common-title-sections">
                            <h3>Best Pricing Plans</h3>
                        </div>
                        {/* <div className="feature-content-headings mb-5">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua ad minim veniam.</p>
                </div> */}
                    </div>
                    {/* <div className="col-lg-6 col-12 ">
                <div className="pricing-monthly pricing-mon">
                    <div className="price-month">
                        <p>Monthly</p>
                    </div>
                    <div className="price-image">
                        <label className="toggle-switch" for="status7">
                            <input type="checkbox" className="toggle-switch-input" id="status7" checked="" />
                            <span className="toggle-switch-label">
                                <span className="toggle-switch-indicator"></span>
                            </span>
                        </label>
                    </div>
                    <div className="price-annual">
                        <p>Annually Save 30%</p>
                    </div>
                </div>
            </div> */}
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-sm-6 col-12 d-flex">
                        <div className="freeplan flex-fill">
                            <div className="freeplan-set mb-1 p-1">
                                <div class="card-body sv-freeplan  rounded mb-3">
                                    <div class="d-flex align-items-center mb-2">
                                        <div style={{ background: "#047EFF" }} class=" text-white p-2 rounded me-2 d-flex align-items-center justify-content-center" >
                                            ⭐
                                        </div>
                                        <h3 class="mb-0 fw-bold">Monthly Plan</h3>
                                    </div>
                                    <hr />
                                    <h2 class="fw-bold text-dark">₹100</h2>
                                </div>
                                <p>Include : </p>
                                <p className="pro-list">Team limit - No Limit</p>
                                <p className="pro-list">Admin Access - 1 Admin</p>
                                <p className="pro-list">Features - All feature</p>
                                <p className="pro-list">Invoice - ₹500/month Extra </p>
                                <p className="pro-list">Manage Policy</p>
                                <p className="pro-list">Manage Structure</p>
                                <p className="pro-list">Plan Expiry Behavior- No Buffer</p>
                            </div>
                            {/* <div className="freeplan-btn">
                                <a href="#" target="blank" className="btn btn-freeplanset">Get started for free</a>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12 d-flex">
                        <div className="bg-pink freeplan plus-plan flex-fill">
                            <div className="freeplan-set mb-1">
                            <div class="card-body sv-freeplan  rounded mb-3">
                                    <div class="d-flex align-items-center mb-2">
                                        <div style={{ background: "#047EFF" }} class=" text-white p-2 rounded me-2 d-flex align-items-center justify-content-center" >
                                            ⭐⭐
                                        </div>
                                        <h3 class="mb-0 fw-bold text-dark">6 Monthl Plan</h3>
                                    </div>
                                    <hr  className='text-dark'/>
                                    <h2 class="fw-bold text-dark">₹300
                                    <small className='text-dark'>(10% off)</small>
                                    </h2>
                                </div>
                                <p>Include : </p>
                                <p className="pro-list">Team limit - No Limit</p>
                                <p className="pro-list">Admin Access - 2 Admin</p>
                                <p className="pro-list">Features - All feature</p>
                                <p className="pro-list">Invoice - Additional Charges Apply </p>
                                <p className="pro-list">Manage Policy</p>
                                <p className="pro-list">Manage Structure</p>
                                <p className="pro-list">Plan Expiry Behavior- 5 days Buffer</p>
                            </div>
                            {/* <div className="freeplan-btn">
                        <a href="#" target="blank" className="btn btn-freeplanset">Get started for free</a>
                    </div> */}
                            <div className="bg-set">
                                <img src="assets/img/groupset.png" alt="img" className="bs-img1" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12 d-flex">
                        <div className="freeplan plus-plan text-dark bg-warning flex-fill position-relative">
                            <div className="recom-price">Recommended</div>
                            <div className="freeplan-set mb-1">
                            <div class="card-body sv-freeplan  rounded mb-3">
                                    <div class="d-flex align-items-center mb-2">
                                        <div style={{ background: "#047EFF" }} class=" text-white p-2 rounded me-2 d-flex align-items-center justify-content-center" >
                                            ⭐⭐⭐
                                        </div>
                                        <h3 class="mb-0 fw-bold text-dark">Yearly Plan</h3>
                                    </div>
                                    <hr className='text-dark'/>
                                    <h2 class="fw-bold text-dark">₹500
                                        <small className='text-dark'>(20% off)</small>
                                    </h2>
                                </div>
                                <p>Include : </p>
                                <p className="pro-list">Team limit - No Limit</p>
                                <p className="pro-list">Admin Access - 4 Admin</p>
                                <p className="pro-list">Features - All feature</p>
                                <p className="pro-list">Invoice - included </p>
                                <p className="pro-list">Manage Policy</p>
                                <p className="pro-list">Manage Structure</p>
                                <p className="pro-list">Plan Expiry Behavior- 7 days Buffer</p>
                            </div>
                            {/* <div className="freeplan-btn">
                        <a href="#" target="blank" className="btn btn-freeplanset">Get started for free</a>
                    </div> */}
                            <div className="bg-set">
                                <img src="assets/img/groupset.png" alt="img" className="bs-img1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricing
