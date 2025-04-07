import React, { useState } from 'react'

function Testimonial() {
    const [activeTab ,setActiveTab]= useState(0)
    const modules = [
        { title: "Admin Management", img: "assets/img/NewDashboard.png" },
        { title: "Employee Management", img: "https://example.com/images/employee.png" },
        { title: "Leave Management", img: "assets/img/features/feature-02.jpg" },
        { title: "Attendance Management", img: "https://example.com/images/attendance.png" },
        { title: "Salary Management", img: "https://example.com/images/salary.png" },
        { title: "Asset Management", img: "https://example.com/images/asset.png" },
        { title: "Holiday Management", img: "https://example.com/images/holiday.png" },
        { title: "Company Structure Management", img: "https://example.com/images/company_structure.png" },
        { title: "Reminders", img: "https://example.com/images/reminders.png" },
        { title: "Invoice Management", img: "https://example.com/images/invoice.png" },
        { title: "Customer Management", img: "https://example.com/images/customer.png" }
    ];
    return (
        <div class="main-testimonial-slides">
            <div class="container">
                <div class="row" data-aos="fade-up" data-aos-duration="2000">
                    <div class="common-title-sections">
                        <h3 className='text-dark m-0'>Essential Features for HRMS SaaS Solutions
                        </h3>
                    </div>
                </div>
                <div class="row" data-aos="fade-up" data-aos-duration="2000">
                    <div class="col-lg-3 col-sm-12 col-12 tabheader ">
                        <ul class="nav nav-tabs clients " id="myTab" role="tablist" >
                            {
                                modules?.map((item, index) => {
                                    return (
                                        <li key={index} class="nav-item" role="presentation">
                                            <button class={`nav-link ${modules[activeTab].title == item.title ?"active":""} `}
                                            onClick={()=>{
                                                setActiveTab(index)
                                            }}
                                             >{
                                                item?.title}</button>
                                        </li>
                                    )
                                })
                            }
                          
                        </ul>
                    </div>
                    <div class="col-lg-9 col-sm-12 col-12 tabcontentsview ">
                        <div class="tab-content " id="myTabContent" >
                            <div class="tab-pane fade show active" id="client" role="tabpanel" aria-labelledby="client-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src={modules[activeTab]?.img || "assets/img/NewDashboard.png"} alt="img" />
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonial
