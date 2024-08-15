import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="54.17 72.183 237.063 66.366" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <style>{`
        @import url(https://fonts.googleapis.com/css2?family=Sora%3Aital%2Cwght%400%2C100..800&display=swap);
        @import url(https://fonts.googleapis.com/css2?family=Combo%3Aital%2Cwght%400%2C400&display=swap);
      `}</style>
    </defs>
    <text style={{fill: "rgb(51, 51, 51)", fontFamily: "Sora", fontSize: "40px", fontWeight: 600, whiteSpace: "pre"}} x="61.432" y="109.819">Big Gallery</text>
    <text style={{fill: "rgb(255, 0, 0)", fontFamily: "Combo", fontSize: "20px", fontWeight: 700, letterSpacing: "1.5px", whiteSpace: "pre"}} x="157.541" y="126.777">catalyst ed.</text>
  </svg>
);

export default Logo;