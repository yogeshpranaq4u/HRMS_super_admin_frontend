import React, { useState } from "react";

const faqData = [
  { question: "How does the subscription model work?", answer: "Our subscription model is flexible and allows monthly or yearly payments." },
  { question: "Is there a free trial available?", answer: "Yes, we offer a 14-day free trial with no credit card required." },
  { question: "What features are included in the HRMS?", answer: "The HRMS includes payroll management, attendance tracking, and performance reviews." },
  { question: "How secure is my data?", answer: "Your data is highly secure with us, protected by advanced encryption, regular backups, and strict access controls." }
];

const FAQ = ({handleOpen}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="pb-3 faqs">
    <div className="faq-container" data-aos="fade-up">
      <div className="faq-left">
        <h2>See Common Question and Answer</h2>
        <p>This FAQ section can help potential users better understand your SaaS HRMS and address their common concerns.</p>
        <button onClick={()=>{handleOpen()}} className="btn btn-primary">Book a Demo →</button>
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