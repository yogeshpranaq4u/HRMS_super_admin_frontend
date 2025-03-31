import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonial from "./components/Testimonial";
import MainNews from "./components/MainNews";
import Pricing from "./components/Pricing";
import FAQ from "./components/Faqs";
import TestimonialOne from "./components/TestimonialOne";
import DemoRequestModal from "./components/DemoModal";
import Features from "./components/Features";

function App() {
  const [show, setShow] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 2000, // Animation duration
      once: true, // Animation occurs once per scroll
    });
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  
  }, []);
  const handleOpen = (v) => {
    setShow(true)
  }
  return (
    <React.Fragment>
      <div className="media-icons">
        <a href="https://wa.me/919600008844" className="whatsap-icon" target="_blank"><i className="fa-brands fa-whatsapp"></i></a>
        <a href="mailto:support@dreamstechnologies.com" className="mail-icon"><i className="fa-regular fa-envelope"></i></a>
        <a href="https://join.skype.com/invite/KqfsfMbmDu9a" className="skype-icon" target="_blank"><i className="fa-brands fa-skype"></i></a>
      </div>
      <main className="second-landing-page">
        <Header handleOpen={handleOpen} />
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

                    <h1 className="mb-2 text-white aos-init aos-animate" data-aos="fade-up" data-aos-duration="1500">
                      Future-Ready HR for a Dynamic Workplace.
                    </h1>
                    <p data-aos="fade-up" data-aos-duration="1500" data-aos-delay="300" data-aos-once="true" className="text-white">Prepare your HR department for the future with our adaptable HRMS, designed to meet the needs of a dynamic workplace and foster a culture of continuous improvement.</p>

                    {/* <a href="#" className="d-inline-flex align-items-center btn btn-primary aos-init aos-animate" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="400" data-aos-once="true">Book a Demo <i className="ti ti-arrow-right ms-1"></i></a> */}
                    <button className="req-btn" onClick={handleOpen} data-aos="fade-up" data-aos-duration="1500" data-aos-delay="400" data-aos-once="true">Book a Demo →</button>
                    <div className="banner-users py-4 d-flex gap-4 aos-init aos-animate" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="500" data-aos-once="true">
                      <div className="avatar-list-stacked avatar-group-lg me-2">
                        <span className="avatar avatar-lg rounded-circle border-0"><img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/profile/avatar-05.jpg" className="img-fluid rounded-circle border border-white" alt="Img" /></span>
                        <span className="avatar avatar-lg rounded-circle border-0"><img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/profile/avatar-05.jpg" className="img-fluid rounded-circle border border-white" alt="Img" /></span>
                        <span className="avatar avatar-lg rounded-circle border-0"><img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/profile/avatar-05.jpg" className="img-fluid rounded-circle border border-white" alt="Img" /></span>
                      </div>
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className="d-flex align-items-center  gap-1 bold m-0">
                          <div className="d-flex align-items-center m-0">
                            {
                              [1, 2, 3, 4, 5]?.map((item) => {
                                return (
                                  <i key={item} className="fa-solid fa-star " style={{ color: "gold" }}></i>
                                )
                              })
                            }
                          </div>
                          <p className="m-0 p-0">5.0 Ratings</p>
                        </div>
                        <h6 className="bold mt-1 w-100">325k Satisfied Customers</h6>
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
                      <img src="assets/img/OBJECTS.png" alt="main-slider" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* fe */}
        <div className="main-subscribe " id="contact" data-aos="fade-up" data-aos-duration="2000">
          <div className="container">
            <div className="row">
              <div className="main-subscribe-content">
                <div className="subscribe-vector-left"><img src="assets/img/vector/subscribe-left.png" alt="img" /></div>
                <div className="subscribe-vector-bottom"><img src="assets/img/vector/subscribe-center.png" alt="img" /></div>
                <div className="subscribe-vector-right"><img src="assets/img/vector/subscribe-right.png" alt="img" /></div>
                <div className="text-start pl-3 title pb-2">
                  <h2 data-aos="fade-up" data-aos-duration="1500" data-aos-once="true" className="text-white bold">Developing company values for a<br className="d-none d-lg-block" /> HRMS Software</h2>
                </div>
                <div className="row justify-content-center ">
                  {
                    [1, 2, 3]?.map((item, index) => {
                      return (
                        <div key={index} className="col-md-6 col-lg-4 col-12 mb-2 ">
                          <div className="card aos-init aos-animate" data-aos="flip-left" data-aos-duration="1500" data-aos-once="true">
                            <div className="card-body sv-card-body">
                              <span className="hrms-software-icon">
                                <i className="ti ti-arrow-big-up-line-filled text-primary fs-22"></i>
                              </span>
                              <h3>Scalability &amp; Performance</h3>
                              <p className="text-gray-5  line-clamb-3">Utilize cloud hosting for scalability, ensuring can grow with your user base.Ensure that the system can handle varying loads</p>
                            </div>

                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>

            {/* <div className="row">
            <div className="d-flex gap-2" >
              <marquee className="d-flex gap-2">
                {
                  [1,2,3,3,4,4,5,5,3,6,6,6,]?.map((item, index) => {
                    return (
                      <div className="support-item">
                        <img src="https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/icon/brand1.svg" alt="img" className="brand-logos" />
                      </div>
                    )
                  })
                }

              </marquee>
            </div>
          </div> */}
          </div>
        </div>
        {/* Testimonial */}
        <Testimonial />
        {/* features 1 */}
        <Features handleOpen={handleOpen} />
        {/* pricing */}
        <Pricing />
        {/* faq */}
        <FAQ handleOpen={handleOpen} />
        {/* TestimonialOne */}
        <TestimonialOne />
        {/* main news */}
        <MainNews />
        <DemoRequestModal show={show} handleClose={() => { setShow(false) }} />
      </main>
      <div className="back-to-top">
        <a className={`back-to-top-icon align-items-center justify-content-center d-flex ${showBackToTop ? "show" :""}`} href="#top"><i className="fa-solid fa-arrow-up"></i></a>
      </div>
    </React.Fragment>
  );
}

export default App;
