import React from 'react'

function Testimonial() {
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
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="client-tab" data-bs-toggle="tab" data-bs-target="#client" type="button" role="tab" aria-controls="client" aria-selected="true">Client Management</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="employee-tab" data-bs-toggle="tab" data-bs-target="#employee" type="button" role="tab" aria-controls="employee" aria-selected="false">Employee Management</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="project-tab" data-bs-toggle="tab" data-bs-target="#project" type="button" role="tab" aria-controls="project" aria-selected="false">Project Management</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="video-tab" data-bs-toggle="tab" data-bs-target="#video" type="button" role="tab" aria-controls="video" aria-selected="false">Video Call System</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="cal-tab" data-bs-toggle="tab" data-bs-target="#cal" type="button" role="tab" aria-controls="audio" aria-selected="false">Calendar Module</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="events-tab" data-bs-toggle="tab" data-bs-target="#events" type="button" role="tab" aria-controls="audio" aria-selected="false">Events Module</button>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-9 col-sm-12 col-12 tabcontentsview ">
                        <div class="tab-content " id="myTabContent" >
                            <div class="tab-pane fade show active" id="client" role="tabpanel" aria-labelledby="client-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-01.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="employee" role="tabpanel" aria-labelledby="employee-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-02.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="project" role="tabpanel" aria-labelledby="project-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-03.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="video" role="tabpanel" aria-labelledby="video-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-04.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="audio" role="tabpanel" aria-labelledby="audio-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-05.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="cal" role="tabpanel" aria-labelledby="cal-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-06.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="events" role="tabpanel" aria-labelledby="events-tab">
                                <div class="client-item">
                                    <div class="col-lg-12 client-img">
                                        <img src="assets/img/features/feature-07.jpg" alt="img" />
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
