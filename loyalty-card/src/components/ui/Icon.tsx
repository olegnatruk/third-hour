import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Line-icon set exported from the Figma "Components" section
 * (nodes 27:3–27:63). Path data is transcribed verbatim from the
 * Figma SVG exports (also committed under /public/icons); the only
 * change is stroke -> currentColor so icons inherit text color.
 * All icons are on a 24×24 grid.
 */
export type IconName =
  | "menu"
  | "bell"
  | "chevron-left"
  | "chevron-right"
  | "eye"
  | "home"
  | "history"
  | "profile"
  | "settings"
  | "qr"
  | "gift"
  | "check"
  | "camera"
  | "search"
  | "refresh"
  | "lock"
  | "plus"
  | "minus"
  | "alert";

const ICONS: Record<IconName, ReactNode> = {
  menu: (
    <path
      d="M3 6H21M3 12H21M3 18H21"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  ),
  bell: (
    <path
      d="M13.7 21C13.5206 21.2894 13.2703 21.5283 12.9728 21.6939C12.6754 21.8595 12.3405 21.9464 12 21.9464C11.6595 21.9464 11.3246 21.8595 11.0272 21.6939C10.7297 21.5283 10.4794 21.2894 10.3 21M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chevron-left": (
    <path
      d="M15 18L9 12L15 6"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "chevron-right": (
    <path
      d="M9 18L15 12L9 6"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  eye: (
    <>
      <path
        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        strokeWidth={1.8}
      />
    </>
  ),
  home: (
    <path
      d="M3 10.5L12 3L21 10.5M5 9.5V21H19V9.5"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  history: (
    <path
      d="M4 6.5C4 5.83696 4.26339 5.20107 4.73223 4.73223C5.20107 4.26339 5.83696 4 6.5 4H15L20 9V17.5C20 18.163 19.7366 18.7989 19.2678 19.2678C18.7989 19.7366 18.163 20 17.5 20H6.5C5.83696 20 5.20107 19.7366 4.73223 19.2678C4.26339 18.7989 4 18.163 4 17.5V6.5Z"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  ),
  profile: (
    <>
      <path
        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
        strokeWidth={1.8}
      />
      <path
        d="M4 21C5.8 17 8.6 15 12 15C15.4 15 17.7 17 20 21"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  ),
  settings: (
    <>
      <path
        d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z"
        strokeWidth={1.8}
      />
      <path
        d="M12 3V5.5M12 18.5V21M4.2 7L6.4 8.3M17.6 15.7L19.8 17M4.2 17L6.4 15.7M17.6 8.3L19.8 7"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  ),
  qr: (
    <path
      d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H16V16H14V14ZM18 14H20V16H18V14ZM14 18H16V20H14V18ZM18 18H20V20H18V18Z"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  ),
  gift: (
    <path
      d="M12 7V20M12 7C12 7 10.5 3 8 4C5.5 5 8.5 7 12 7ZM12 7C12 7 13.5 3 16 4C18.5 5 15.5 7 12 7ZM4 11H20V20H4V11ZM3 7H21V11H3V7Z"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  ),
  check: (
    <path
      d="M5 13L9 17L19 7"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  camera: (
    <>
      <path
        d="M3 8.5C3 7.83696 3.26339 7.20107 3.73223 6.73223C4.20107 6.26339 4.83696 6 5.5 6H7.3L8.6 4H13.4L14.7 6H16.5C16.8315 5.40326 17.3865 4.96266 18.0429 4.77513C18.6993 4.58759 19.4033 4.66848 20 5C20.5967 5.33152 21.0373 5.88652 21.2249 6.54289C21.4124 7.19927 21.3315 7.90326 21 8.5V17.5C21 18.163 20.7366 18.7989 20.2678 19.2678C19.7989 19.7366 19.163 20 18.5 20H5.5C4.83696 20 4.20107 19.7366 3.73223 19.2678C3.26339 18.7989 3 18.163 3 17.5V8.5Z"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <path
        d="M12 16.5C13.933 16.5 15.5 14.933 15.5 13C15.5 11.067 13.933 9.5 12 9.5C10.067 9.5 8.5 11.067 8.5 13C8.5 14.933 10.067 16.5 12 16.5Z"
        strokeWidth={1.7}
      />
    </>
  ),
  search: (
    <>
      <path
        d="M11 17.5C14.5899 17.5 17.5 14.5899 17.5 11C17.5 7.41015 14.5899 4.5 11 4.5C7.41015 4.5 4.5 7.41015 4.5 11C4.5 14.5899 7.41015 17.5 11 17.5Z"
        strokeWidth={1.8}
      />
      <path
        d="M20 20L16 16"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  ),
  refresh: (
    <path
      d="M20 11C19.7471 9.07074 18.7998 7.29978 17.3353 6.01862C15.8709 4.73747 13.9897 4.03395 12.0439 4.03977C10.0982 4.04559 8.22124 4.76034 6.76447 6.05023C5.3077 7.34012 4.37097 9.11672 4.12963 11.0475C3.88829 12.9782 4.35888 14.9307 5.45331 16.5395C6.54775 18.1483 8.19099 19.3031 10.0754 19.7877C11.9599 20.2722 13.9564 20.0534 15.6911 19.1722C17.4259 18.2909 18.78 16.8076 19.5 15M14 11H20V5"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  lock: (
    <>
      <path
        d="M17 10H7C5.89543 10 5 10.8954 5 12V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V12C19 10.8954 18.1046 10 17 10Z"
        strokeWidth={1.8}
      />
      <path
        d="M8 10V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V10"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  ),
  plus: (
    <path
      d="M12 5V19M5 12H19"
      strokeWidth={2}
      strokeLinecap="round"
    />
  ),
  minus: (
    <path d="M5 12H19" strokeWidth={2} strokeLinecap="round" />
  ),
  alert: (
    <>
      <path
        d="M12 3L2 20H22L12 3Z"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M12 9V14M12 17H12.01"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {ICONS[name]}
    </svg>
  );
}
