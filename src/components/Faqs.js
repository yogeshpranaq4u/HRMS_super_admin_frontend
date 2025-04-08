import React, { useState } from "react";

const faqData = [
  {
    question: "What is an HRMS and how can it help my business?",
    answer:
      "An HRMS (Human Resource Management System) is a software tool that helps you manage HR functions such as employee records, attendance, leave, payroll, performance, and more. It streamlines processes, reduces manual work, and improves overall HR efficiency.",
  },
  {
    question: "Is there a limit to the number of employees I can manage?",
    answer:
      "No, our system is designed to scale with your business. From startups to enterprises, you can manage unlimited employees based on the plan you choose.",
  },
  {
    question: "Can I manage multiple locations or departments?",
    answer:
      "Yes! Our HRMS allows you to define departments, branches, and reporting hierarchies, so you can manage multi-location teams with ease.",
  },
  {
    question: "Is employee data safe and secure in your HRMS?",
    answer:
      "Absolutely. We use industry-standard encryption and data protection practices to ensure all employee information is securely stored and accessible only to authorized users.",
  },
  {
    question: "Does the system support payroll and salary slip generation?",
    answer:
      "Yes. You can automate payroll calculations, generate salary slips, and track payment history — all within the platform.",
  },
  {
    question: "Can employees apply for leave and view attendance themselves?",
    answer:
      "Yes. Employees have their own self-service portal where they can apply for leave, check attendance, view payslips, and more.",
  },
  {
    question: "Can I customize leave policies and holidays?",
    answer:
      "Definitely. You can set custom leave types, carry-forward rules, and define holidays based on region or office location.",
  },
  {
    question: "Do you provide support and training?",
    answer:
      "Yes, we offer dedicated onboarding support, video tutorials, and live chat/email assistance to help you get started and resolve any issues quickly.",
  },
];


const FAQ = ({handleOpen}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="pt-4 faqs">
    <div className="faq-container" data-aos="fade-up">
      <div className="faq-left">
        <h2>See Common Question and Answer</h2>
        <p>This FAQ section can help potential users better understand your SaaS HRMS and address their common concerns.</p>
        <button onClick={()=>{handleOpen()}} className="btn btn-primary mb-3">Book a Demo →</button>
      </div>
      <div className="faq-right">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? "active" : ""}`} onClick={() => toggleFAQ(index)}>
            <div className="faq-question">
              <span>{item.question}</span>
              <span className="faq-icon">{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default FAQ;