import React from 'react';

const ProgressCircle = ({current, total}: {
  current: number;
  total: number;
}) => {

  const percentage = (current / total) * 100;

  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-block w-9 h-9">
      {/* Outer circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="var(--background)"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="var(--accent)" // Change to desired progress color
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;