import React, { useEffect } from "react";
import Header from "./components/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonial from "./components/Testimonial";
import MainNews from "./components/MainNews";
import Pricing from "./components/Pricing";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 2000, // Animation duration
      once: true, // Animation occurs once per scroll
    });
  }, []);
  return (
    <main className="second-landing-page">
      <Header />
      {/* banner */}
      <div className="main-banner-section"
        data-aos="fade-up" data-aos-duration="2000"
      >
        <div className="home-section-vector-left-top"><img src="assets/img/vector/vector-home-left.png" alt="vector-image" /></div>
        <div className="home-section-vector-left-bottom"><img src="assets/img/vector/vector-home-left-bottom.png" alt="vector-image" /></div>
        <div className="home-section-vector-right-top"><img src="assets/img/vector/vector-home-top.png" alt="vector-image" /></div>
        <div className="home-section-vector-right-bottom"><img src="assets/img/vector/vector-home-bottom.png" alt="vector-image" /></div>
        <div className="container">
          <div className="row">
            <div className="homepage-section d-flex justify-content-center">
              <div className="col-lg-5 col-sm-5 col-12">
                <div className="process-content">

                  <h1 className="mb-2 aos-init aos-animate" data-aos="fade-up" data-aos-duration="1500">
                    Future-Ready HR for a Dynamic Workplace.
                  </h1>
                  <p data-aos="fade-up" data-aos-duration="1500" data-aos-delay="300" data-aos-once="true" className="aos-init aos-animate">Prepare your HR department for the future with our adaptable HRMS, designed to meet the needs of a dynamic workplace and foster a culture of continuous improvement.</p>
                  <a href="#" className="d-inline-flex align-items-center btn btn-primary aos-init aos-animate" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="400" data-aos-once="true">Book a Demo <i className="ti ti-arrow-right ms-1"></i></a>
                  <div className="banner-users py-4 d-flex aos-init aos-animate" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="500" data-aos-once="true">
                    <div className="avatar-list-stacked avatar-group-lg me-2">
                      <span className="avatar avatar-lg rounded-circle border-0"><img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/profile/avatar-05.jpg" className="img-fluid rounded-circle border border-white" alt="Img" /></span>
                      <span className="avatar avatar-lg rounded-circle border-0"><img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/profile/avatar-05.jpg" className="img-fluid rounded-circle border border-white" alt="Img" /></span>
                      <span className="avatar avatar-lg rounded-circle border-0"><img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/profile/avatar-05.jpg" className="img-fluid rounded-circle border border-white" alt="Img" /></span>
                    </div>
                    <div className="d-flex flex-column align-items-center justify-center">
                      <div className="d-flex align-items-center gap-1 bold m-0">
                        <div className="d-flex align-items-center me-2 m-0">
                          <i className="ti ti-star-filled text-primary"></i>
                          <i className="ti ti-star-filled text-primary"></i>
                          <i className="ti ti-star-filled text-primary"></i>
                          <i className="ti ti-star-filled text-primary"></i>
                          <i className="ti ti-star-filled text-primary"></i>
                        </div>
                        <p className="m-0 p-0">5.0 Ratings</p>
                      </div>
                      <h6 className="bold">325k Satisfied Customers</h6>
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-lg-7 col-sm-7 col-12">
                <div className="main-slider">
                  <div className="slider-vector-layer"><img src="assets/img/vector/slider-vector-bottom-left.png" alt="vector-image" /></div>
                  <div className="slider-vector-layers"><img src="assets/img/vector/slider-vector-bottom-right.png" alt="vector-image" /></div>
                  <div className="slider-vector-top-left"><img src="assets/img/vector/slider-vector-top.png" alt="vector-image" /></div>
                  <div className="shadow rounded">
                    <img src="assets/img/NewDashboard.png" alt="main-slider" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* pricing */}

      <Pricing/>

      {/* Testimonial */}
      <Testimonial />


      {/* main news */}

      <MainNews />


    </main>
  );
}

export default App;
