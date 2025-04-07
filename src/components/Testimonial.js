import React, { useState } from 'react'

function Testimonial() {
    const [activeTab ,setActiveTab]= useState(0)
    const modules = [
        { title: "Admin Management", img: "assets/img/NewDashboard.png" },
        { title: "Employee Management", img: "assets/img/Employee-page.png" },
        { title: "Leave Management", img: "assets/img/LeaveManagement.png" },
        { title: "Attendance Management", img: "assets/img/Attendance.png" },
        { title: "Salary Management", img: "assets/img/SalaryPage.png" },
        { title: "Asset Management", img: "assets/img/AssetsManagement.png" },
        { title: "Holiday Management", img: "assets/img/HolidayManagement.png" },
        { title: "Company Structure Management", img: "assets/img/ManageStructure.png" },
        { title: "Reminders", img: "assets/img/Reminder.jpg" },
        { title: "Invoice Management", img: "assets/img/Invoicemanagement.png" },
        { title: "Customer Management", img: "assets/img/Customer-management.png" }
    ];
    return (
        <div className="main-testimonial-slides">
            <div className="container">
                <div className="row" data-aos="fade-up" data-aos-duration="2000">
                    <div className="common-title-sections">
                        <h3 className='text-dark m-0'>Essential Features for HRMS SaaS Solutions
                        </h3>
                    </div>
                </div>
                <div className="row" data-aos="fade-up" data-aos-duration="2000">
                    <div className="col-lg-3 col-sm-12 col-12 tabheader ">
                        <ul className="nav nav-tabs clients " id="myTab" role="tablist" >
                            {
                                modules?.map((item, index) => {
                                    return (
                                        <li key={index} className="nav-item" role="presentation">
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
                    <div className="col-lg-9 col-sm-12 col-12 tabcontentsview ">
                        <div className="tab-content " id="myTabContent" >
                            <div className="tab-pane fade show active" id="client" role="tabpanel" aria-labelledby="client-tab">
                                <div className="client-item">
                                    <div className="col-lg-12 client-img">
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
