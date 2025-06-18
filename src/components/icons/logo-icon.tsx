import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  const redColor = "#D4002C";
  const lightBlueColor = "#00AEEF";
  const darkBlueColor = "#00529B";
  const whiteColor = "#FFFFFF";
  
  const ringRadius = 32; // Outer ring radius from center 50,50
  const ringStrokeWidth = 9;
  const sphereRadius = 23; // Inner sphere radius

  // Pre-calculated values for dasharray to create partial circle strokes
  // circumference = 2 * Math.PI * ringRadius; (approx 201.06 for r=32)
  const circumferenceVal = 201.06; 
  const quarterCircleVal = 50.265; // circumference / 4
  const halfCircleVal = 100.53;    // circumference / 2

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100" // Defines the coordinate system for the SVG
      {...props} // Spreads other props like className, width, height
    >
      {/* Outer Ring Segments - achieved by styling full circles with dasharrays and rotations */}
      <circle 
        cx="50" cy="50" r={ringRadius}
        stroke={redColor} strokeWidth={ringStrokeWidth} fill="none"
        strokeDasharray={`${quarterCircleVal} ${circumferenceVal - quarterCircleVal}`}
        transform="rotate(-135 50 50)" // Positions this quarter segment to the top-left
      />
      <circle 
        cx="50" cy="50" r={ringRadius}
        stroke={lightBlueColor} strokeWidth={ringStrokeWidth} fill="none"
        strokeDasharray={`${quarterCircleVal} ${circumferenceVal - quarterCircleVal}`}
        transform="rotate(-45 50 50)" // Positions this quarter segment to the top-right
      />
      <circle 
        cx="50" cy="50" r={ringRadius}
        stroke={darkBlueColor} strokeWidth={ringStrokeWidth} fill="none"
        strokeDasharray={`${halfCircleVal} ${halfCircleVal}`}
        transform="rotate(45 50 50)" // Positions this half segment to the bottom
      />
      
      {/* Central Dark Blue Sphere */}
      <circle cx="50" cy="50" r={sphereRadius} fill={darkBlueColor} />

      {/* White 'Q' Letter (Stylized and scaled relative to sphereRadius) */}
      {/* 'O' part of Q */}
      <path 
        d={`M ${50 - 0.5} ${50 - sphereRadius * 0.35} 
           A ${sphereRadius * 0.45} ${sphereRadius * 0.45} 0 1 0 ${50 - 0.5} ${50 + sphereRadius * 0.35} 
           A ${sphereRadius * 0.45} ${sphereRadius * 0.45} 0 0 0 ${50 - 0.5} ${50 - sphereRadius * 0.35} Z`}
        fill={whiteColor} 
      />
      {/* Tail of Q */}
      <polygon 
        points={`${50 + sphereRadius * 0.1},${50 + sphereRadius * 0.2} 
                 ${50 + sphereRadius * 0.55},${50 + sphereRadius * 0.55} 
                 ${50 + sphereRadius * 0.4},${50 + sphereRadius * 0.25}`} 
        fill={whiteColor} 
      />
      
      {/* Simplified Pixel-like Elements (decorative, positions are approximate) */}
      <rect x="25" y="25" width="6" height="6" fill={redColor} transform="rotate(-20 28 28)" />
      <rect x="33" y="20" width="4.5" height="4.5" fill={lightBlueColor} transform="rotate(10 35.25 22.25)"/>
      <rect x="19" y="31" width="3.5" height="3.5" fill={darkBlueColor} />
    </svg>
  );
}
