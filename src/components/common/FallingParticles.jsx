import React from 'react';

const FallingParticles = ({ count = 30 }) => {
  const particles = Array.from({ length: count }).map((_, i) => {
    const style = {
      '--x-start': `${Math.random() * 100}vw`,
      '--x-end': `${Math.random() * 100}vw`,
      animationDuration: `${5 + Math.random() * 5}s`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return <div key={i} className="particle" style={style}></div>;
  });

  return <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">{particles}</div>;
};

export default FallingParticles;