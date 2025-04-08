import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Counter from "./Counter";


const TestimonialOne = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const testimonials = [
        {
            name: "Applepie",
            company: "Applepie",
            text: "The platform’s reporting tools give us all the data we need, from attendance to team metrics, in one place. It’s drastically cut down the time we spend preparing reports.",
            logo: "assets/img/Applepie.png",
            rating: 5,
        },
        {
            name: "Robert Frost",
            company: "Pet Friendly Place",
            text: "The platform is intuitive and easy to navigate, which reduces the learning curve for new users. Includes all essential modules like payroll, performance management, and employee self-service.",
            logo: "assets/img/Pet.png",
            rating: 5,
        },
        {
            name: "Fitme",
            company: "Fitme",
            text: "Our hiring process is faster and more organized with this platform. From job listings to final onboarding, each step is clear and seamless, helping us secure top talent efficiently.",
            logo: "assets/img/Fitme.png",
            rating: 5,
        },
    ];

    const statsData = [
        { number: "32", label: "Companies Globally" },
        { number: "1832", label: "Employee Database" },
        { number: "39", label: "Turnaround Time" },
        { number: "19", label: "Satisfied Clients" },
    ];


    return (
        <div className="statistics-section">
            <div className="statistics-section text-white pt-4 d-flex justify-content-center">
                <div className="count-section ">
                    <div className="row text-center">
                        {statsData.map((stat, index) => (
                            <div key={index}
                                className="col-md-3 col-sm-6"
                                data-aos="fade-up"
                            >
                                <Counter target={Number(stat.number||100)} />
                                <p className="fs-14 m-0">{stat.label}</p>
                            </div>

                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-plight">
                <div className="testimonial-section container">
                    <div className="row">
                        <div className="col-12 text-start">
                            <h2 className="text-dark px-sm-3">What our customers say about our company</h2>
                        </div>
                    </div>
                    <Slider {...settings} className="testimonial-slider">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="px-2">
                                <div className="testimonial-card">
                                    <h5 className="testimonial-logo d-flex align-items-center gap-2">
                                        <img src={testimonial.logo} alt="img"  style={{maxWidth:"40px"}}/>
                                        {testimonial.name}
                                    </h5>
                                    <p className="testimonial-text">{testimonial.text}</p>
                                    <div className="testimonial-footer justify-content-end">
                                        <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>

    );
};

export default TestimonialOne;