import type { SVGProps } from "react";

export function DiyaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a4 4 0 0 0-4 4c0 1.657 1.79 3 4 3s4-1.343 4-3a4 4 0 0 0-4-4Z" fill="hsl(var(--primary))" stroke="none"/>
      <path d="M4 14c0 2.21 3.582 4 8 4s8-1.79 8-4-3.582-4-8-4-8 1.79-8 4Z" />
      <path d="M4 14v4c0 1.105 3.582 2 8 2s8-.895 8-2v-4" />
    </svg>
  );
}
