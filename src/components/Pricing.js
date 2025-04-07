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
                    <div className="freeplan-set mb-1">
                        <h4>Monthly Plan</h4>
                        {/* <h1>₹ 0 <span>Free Forever</span></h1> */}
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
                        <h4>6 Month Plan ( 10% off )</h4>
                        {/* <h1>₹ 10 <span>User / Month</span></h1> */}
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
                <div className="freeplan plus-plan bg-warning flex-fill position-relative">
                    <div className="recom-price">Recommended</div>
                    <div className="freeplan-set mb-1">
                        <h4>Yearly Plan(20% off)</h4>
                        {/* <h1>₹ 50 <span>User / Month</span></h1> */}
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
