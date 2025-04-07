import React, { useRef } from 'react'

function Features({handleOpen}) {
    const slideRef = useRef()
    const arrowAction = (type) => {
        console.log("slideRef", slideRef);
        if (type == "left") {
            if (slideRef.current) {
                slideRef.current.slickPrev()
            }
        } else {
            if (slideRef.current) {
                slideRef.current.slickNext()
            }
        }
    }


    return (
        <section className="py-3" id='features'>
            <div className="faq-container flex-column" data-aos="fade-up">
                <div className="d-flex justify-content-between align-items-center py-2 w-100">
                    <h2 className="m-0">Features that Help you build better</h2>
                    {/* <div className="slider-btns">
                        <span className="slide-left" onClick={() => { arrowAction("left") }}>
                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                        </span>
                        <span className="slide-right" onClick={() => { arrowAction("right") }}>
                            <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                    </div> */}
                </div>
                <div className='w-100 py-3'>
                    <div className='row'>
                        <div className='col-md-6 '>
                            <div>
                                <p className="text-secondary mb-2">
                                    📊 <strong>Analytics & Reporting</strong>
                                </p>
                                <h2 className="fw-bold text-dark">Build Your Team, Grow Your Excellence</h2>
                                <p className="text-muted">
                                    Streamline HR processes and empower your team with our products.
                                    Facilitate managing employee data, and more in one platform.
                                </p>

                                <ul className="list-unstyled">
                                    {[
                                        "Enables HR professionals to make informed decisions based on real-time data insights.",
                                        "Helps track key performance indicators to measure the effectiveness of HR strategies.",
                                        "Assists in monitoring compliance with regulations and identifying potential risks.",
                                        "Graphs and heat maps to present data visually, making it easier to analyze trends and patterns.",
                                        "Reports for essential HR metrics, turnover rates, employee demographics, and performances."
                                    ].map((item, index) => (
                                        <li key={index} className="d-flex align-items-center mb-2 text-dark">
                                            <i className="fa fa-check text-success me-2" aria-hidden="true"></i>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={()=>{handleOpen()}} className="req-btn mb-2">
                                    Book a Demo →
                                </button>
                            </div>

                        </div>
                        <div className='col-md-6'>
                            <div className='text-end'>
                                <img src='/assets/img/featurenew.png' className='img-fluid' />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default Features
