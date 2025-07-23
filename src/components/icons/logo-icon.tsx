import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--chart-1))', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: 'hsl(var(--chart-2))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--chart-3))', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: 'hsl(var(--chart-4))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--chart-5))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#logo-gradient)" />
      <path
        d="M62.5 37.5H37.5C34.1863 37.5 31.5 40.1863 31.5 43.5V68.5C31.5 71.8137 34.1863 74.5 37.5 74.5H62.5C65.8137 74.5 68.5 71.8137 68.5 68.5V43.5C68.5 40.1863 65.8137 37.5 62.5 37.5Z"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.5 50H68.5"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43.75 25V43.75"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56.25 25V43.75"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
