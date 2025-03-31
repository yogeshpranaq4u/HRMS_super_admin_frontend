import React, { useEffect, useRef, useState } from "react";

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          let currentCount = 0;
          const increment = Math.ceil(target / 100); // Adjust speed
          
          const interval = setInterval(() => {
            currentCount += increment;
            if (currentCount >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(currentCount);
            }
          }, 30); // Adjust timing

          observer.unobserve(counterRef.current);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <h3 ref={counterRef}  className="fw-bold text-white fs-28 m-0">
        {count}+
    </h3>
    // <div className="text-white text-3xl font-bold">
    // </div>
  );
};

export default Counter;
