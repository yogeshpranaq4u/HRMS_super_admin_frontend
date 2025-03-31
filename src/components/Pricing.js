import React from 'react'

function Pricing() {
  return (
    <div class="features-choose-sections" id="pricing">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-12">
                <div class="common-title-sections">
                    <h3>Best Pricing Plans</h3>
                </div>
                <div class="feature-content-headings mb-5">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua ad minim veniam.</p>
                </div>
            </div>
            {/* <div class="col-lg-6 col-12 ">
                <div class="pricing-monthly pricing-mon">
                    <div class="price-month">
                        <p>Monthly</p>
                    </div>
                    <div class="price-image">
                        <label class="toggle-switch" for="status7">
                            <input type="checkbox" class="toggle-switch-input" id="status7" checked="" />
                            <span class="toggle-switch-label">
                                <span class="toggle-switch-indicator"></span>
                            </span>
                        </label>
                    </div>
                    <div class="price-annual">
                        <p>Annually Save 30%</p>
                    </div>
                </div>
            </div> */}
        </div>
        <div class="row justify-content-center">
            <div class="col-lg-4 col-sm-6 col-12 d-flex">
                <div class="freeplan flex-fill">
                    <div class="freeplan-set">
                        <h4>Free Plan</h4>
                        <h1>$ 0 <span>Free Forever</span></h1>
                        <p class="pro-list">For individuals and small projects</p>
                    </div>
                    <div class="freeplan-btn">
                        <a href="#" target="blank" class="btn btn-freeplanset">Get started for free</a>
                    </div>
                </div>
            </div> 
            <div class="col-lg-4 col-sm-6 col-12 d-flex">
                <div class="bg-pink freeplan plus-plan flex-fill">
                    <div class="freeplan-set">
                        <h4>Plus Plan</h4>
                        <h1>$ 10 <span>User / Month</span></h1>
                         <p class="pro-list">For individuals and small projects</p>
                    </div>
                    <div class="freeplan-btn">
                        <a href="#" target="blank" class="btn btn-freeplanset">Get started for free</a>
                    </div>
                    <div class="bg-set">
                        <img src="assets/img/groupset.png" alt="img" class="bs-img1" />
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-sm-6 col-12 d-flex">
                <div class="freeplan plus-plan bg-warning flex-fill position-relative">
                    <div class="recom-price">Recommended</div>
                    <div class="freeplan-set">
                        <h4>Advance Plan</h4>
                        <h1>$ 50 <span>User / Month</span></h1>
                         <p class="pro-list">For individuals and small projects</p>
                    </div>
                    <div class="freeplan-btn">
                        <a href="#" target="blank" class="btn btn-freeplanset">Get started for free</a>
                    </div>
                    <div class="bg-set">
                        <img src="assets/img/groupset.png" alt="img" class="bs-img1" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Pricing
