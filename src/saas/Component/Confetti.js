import React, { useEffect, useRef } from "react";

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const confettiCanvas = canvasRef.current;
    const ctx = confettiCanvas.getContext("2d");

    // Set canvas size to full screen
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettis = [];
    const colors = ["#FF007A", "#7A00FF", "#00FF7A", "#FFD700", "#00D4FF"];

    // Function to create a confetti
    const createConfetti = () => {
      const confetti = {
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 5 + 2,
        rotation: Math.random() * 360,
      };
      confettis.push(confetti);
    };

    // Generate multiple confetti initially
    for (let i = 0; i < 200; i++) {
      createConfetti();
    }

    // Function to animate confetti
    const animateConfetti = () => {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      confettis.forEach((confetti, index) => {
        confetti.x += confetti.speedX;
        confetti.y += confetti.speedY;
        confetti.rotation += confetti.speedX;

        // Draw confetti
        ctx.save();
        ctx.translate(confetti.x, confetti.y);
        ctx.rotate((confetti.rotation * Math.PI) / 180);
        ctx.fillStyle = confetti.color;
        ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size);
        ctx.restore();

        // Remove confetti that go out of the screen
        if (confetti.y > confettiCanvas.height) {
          confettis.splice(index, 1);
        }
      });

      if (confettis.length > 0) {
        requestAnimationFrame(animateConfetti);
      }
    };

    // Start animation after 800ms (simulate delay for zoom effect)
    const animationTimeout = setTimeout(() => {
      animateConfetti();
    }, 800);

    // Cleanup on component unmount
    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} id="confetti" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />;
};

export default Confetti;
