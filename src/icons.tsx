import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...rest }: P) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export const IconCup = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 10h11v3.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 13.5V10Z" />
    <path d="M16 11h1.3a2.35 2.35 0 1 1 0 4.7h-1.6" />
    <path d="M4 21h13" />
    <path d="M8.7 3.6c-.7.9.7 1.6 0 2.5M12.3 3.6c-.7.9.7 1.6 0 2.5" />
  </svg>
);

export const IconGlass = (p: P) => (
  <svg {...base(p)}>
    <path d="M7.6 3h8.8l-.35 4.4A4.55 4.55 0 0 1 12 11.5a4.55 4.55 0 0 1-4.05-4.1L7.6 3Z" />
    <path d="M12 11.5V19" />
    <path d="M8.5 21h7" />
    <path d="M8.1 6.6h7.8" />
  </svg>
);

export const IconBean = (p: P) => (
  <svg {...base(p)}>
    <path d="M7.3 4.9c3.4-2.5 8.3-1.3 10.4 2.4 2.1 3.8.7 8.5-2.9 10.8-3.5 2.2-8.3.8-10.4-2.9C2.4 11.4 3.9 7.4 7.3 4.9Z" />
    <path d="M8.2 6.1c2.4 2.7 5.2 7.4 6.2 11.4" />
  </svg>
);

export const IconGrape = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4.5V7" />
    <path d="M12 4.5c.2-1.4 1.2-2.3 2.8-2.5" />
    <circle cx="9" cy="10" r="2.4" />
    <circle cx="15" cy="10" r="2.4" />
    <circle cx="12" cy="14.2" r="2.4" />
    <circle cx="12" cy="6.8" r="0.4" />
    <circle cx="12" cy="18.6" r="2.2" />
  </svg>
);

export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 11.3 12 4l8 7.3" />
    <path d="M6.3 9.8V20h11.4V9.8" />
    <path d="M10.2 20v-5h3.6v5" />
  </svg>
);

export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 6.6C10 4.9 7 4.5 4 5v13.6c3-.5 6-.1 8 1.6 2-1.7 5-2.1 8-1.6V5c-3-.5-6-.1-8 1.6Z" />
    <path d="M12 6.6V20" />
  </svg>
);

export const IconCompass = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z" />
  </svg>
);

export const IconHeart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20S4.6 15.4 2.8 10.8C1.6 7.7 3.7 4.6 6.9 4.6c2 0 3.6 1.1 4.4 2.7l.7 1.4.7-1.4c.8-1.6 2.4-2.7 4.4-2.7 3.2 0 5.3 3.1 4.1 6.2C19.4 15.4 12 20 12 20Z" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m15.8 15.8 4.4 4.4" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconArrowLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconPencil = (p: P) => (
  <svg {...base(p)}>
    <path d="m4 20 1-4L16.4 4.6a2.05 2.05 0 0 1 2.9 2.9L8 18.9 4 20Z" />
    <path d="m14.5 6.5 3 3" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="1.6" />
    <path d="M5 15V5.6A1.6 1.6 0 0 1 6.6 4H16" />
  </svg>
);

export const IconTrash = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 7h15" />
    <path d="M9.5 7V5h5v2" />
    <path d="m6.5 7 .9 12.5h9.2L17.5 7" />
    <path d="M10 11v5.5M14 11v5.5" />
  </svg>
);

export const IconCamera = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
    <circle cx="12" cy="13.7" r="3.4" />
    <path d="m8.6 7.5 1.4-2.5h4l1.4 2.5" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const IconGear = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M18.2 5.8l-1.5 1.5M7.3 16.7l-1.5 1.5" />
  </svg>
);

export const IconInfo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 11.2v4.6" />
    <path d="M12 7.9h.01" strokeWidth="2" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)} fill="currentColor" strokeWidth="0">
    <path d="M12 2.5c.6 4.7 2.4 7.2 9.5 9.5-7.1 2.3-8.9 4.8-9.5 9.5-.6-4.7-2.4-7.2-9.5-9.5 7.1-2.3 8.9-4.8 9.5-9.5Z" />
  </svg>
);

export const IconDrop = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5c3.2 4 5.6 7 5.6 10a5.6 5.6 0 1 1-11.2 0c0-3 2.4-6 5.6-10Z" />
    <path d="M9.4 13.5a2.6 2.6 0 0 0 2 2.7" />
  </svg>
);

export const IconGoogle = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
    <path fill="#EA4335" d="M12 5.2c1.7 0 3.3.6 4.5 1.7l3.3-3.3C17.8 1.9 15.1 1 12 1 7.6 1 3.8 3.5 2 7.1l3.8 3C6.7 7.3 9.1 5.2 12 5.2Z" />
    <path fill="#4285F4" d="M23 12.3c0-.9-.1-1.6-.2-2.4H12v4.6h6.2c-.3 1.4-1.1 2.7-2.4 3.5l3.7 2.9c2.2-2.1 3.5-5.1 3.5-8.6Z" />
    <path fill="#FBBC05" d="M5.8 14a7 7 0 0 1-.4-2c0-.7.1-1.4.4-2l-3.8-3A11.5 11.5 0 0 0 .5 12c0 1.9.4 3.6 1.5 5.1l3.8-3.1Z" />
    <path fill="#34A853" d="M12 23c3.1 0 5.8-1 7.7-2.8l-3.7-2.9c-1 .7-2.4 1.2-4 1.2-2.9 0-5.3-2.1-6.2-4.5l-3.8 3C3.8 20.5 7.6 23 12 23Z" />
  </svg>
);
