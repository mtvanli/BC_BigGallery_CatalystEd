import React from 'react';

const Logo = ({ width = 224.6257, height = 61.9643 }) => {
  return (
    <svg
      viewBox="60.2743 72.8482 224.6257 61.9643"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          @import url(https://fonts.googleapis.com/css2?family=Sora%3Aital%2Cwght%400%2C100..800&display=swap);
          @import url(https://fonts.googleapis.com/css2?family=Combo%3Aital%2Cwght%400%2C400&display=swap);
        </style>
      </defs>
      <g transform="matrix(1, 0, 0, 1, -1.1576839685440063, 2.546905040740967)">
        <text
          style={{
            fill: 'rgb(51, 51, 51)',
            fontFamily: 'Sora',
            fontSize: '40px',
            fontWeight: 600,
            whiteSpace: 'pre',
          }}
          x="61.432"
          y="109.819"
          transform="matrix(1.010769, 0, 0, 1.023659, -0.661547, -2.869583)"
        >
          Big Gallery
        </text>
        <text
          style={{
            fill: 'rgb(255, 0, 0)',
            fontFamily: 'Combo',
            fontSize: '19.7993px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            whiteSpace: 'pre',
          }}
          transform="matrix(1.035419, 0, 0, 1.010137, -7.200737, -0.893771)"
          x="157.541"
          y="126.777"
        >
          catalyst ed.
        </text>
      </g>
    </svg>
  );
};

export default Logo;