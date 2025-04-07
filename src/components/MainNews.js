import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const newsData = [
    {
        id: 1,
        title: "Top 10 Features Every HR Admin Template Should Have",
        category: "Marketing",
        author: "Justin Langard",
        date: "Aug 30, 2025",
        description:
            "Discuss essential features like employee management, payroll processing, leave...",
        image: "https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/blogs/blog-01.jpg", // Replace with actual image
    },
    {
        id: 2,
        title: "Transforming Onboarding: Why the Right HR Platform is Essential",
        category: "Onboarding",
        author: "Kassandra Perry",
        date: "Jul 18, 2025",
        description:
            "Explain how a streamlined onboarding process can improve new hire satisfaction...",
        image: "https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/blogs/blog-01.jpg",
    },
    {
        id: 3,
        title: "Enhancing Compliance and Document Security with an HR System",
        category: "Management",
        author: "Michael Aldridge",
        date: "Jun 26, 2025",
        description:
            "Discuss how the platform helps HR teams manage compliance and data security mo...",
        image: "https://smarthr.dreamstechnologies.com/html/sass-landing/assets/img/blogs/blog-01.jpg",
    },
];



const MainNews = () => {
    const slideRef = useRef()
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        // nextArrow: <NextArrow />,
        // prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    
    const arrowAction = (type) => {
        console.log("slideRef" ,slideRef);
        if(type == "left"){
            if(slideRef.current){
                slideRef.current.slickPrev()
            }
        }else{
            if(slideRef.current){
                slideRef.current.slickNext()
            }
        }
    }
 

    return (
        <div className="news-slider-container" id="news">
            <div className="d-flex justify-content-between align-items-center py-2">
                <h2 className="m-0">Our recent News & Insights</h2>
                <div className="slider-btns">
                    <span className="slide-left" onClick={()=>{arrowAction("left")}}>
                        <i className="fa fa-angle-left" aria-hidden="true"></i>
                    </span>
                    <span className="slide-right" onClick={()=>{arrowAction("right")}}>
                        <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
            <div className="pt-3">
            <Slider {...settings} ref={slideRef}>
                {newsData.map((news) => (
                    <div key={news.id} className="px-2">
                        <div className="news-card">
                            <div className="news-image">
                                <img src={news.image} alt={news.title} />
                                <span className="news-category">{news.category}</span>
                            </div>
                            <div className="news-content">
                                <h3 className="">{news.title}</h3>
                                <p className="news-meta">
                                    {news.author} • {news.date}
                                </p>
                                <p className="news-description ">{news.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            </div>
        </div>
    );
};

export default MainNews;
