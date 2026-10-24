// Thin line icons used across the app. Usage: <Icon name="heart" size={18} />
const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  heart: <path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20Z" />,
  bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="1" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  card: <><rect x="3" y="6" width="18" height="13" rx="1" /><path d="M3 10h18" /></>,
  cardOff: <><rect x="3" y="6" width="18" height="13" rx="1" /><path d="M3 10h18M4 4l16 17" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" /><path d="M3 9h18M12 9v11M12 9S10 4 7.5 5.5 9 9 12 9Zm0 0s2-5 4.5-3.5S15 9 12 9Z" /></>,
  shield: <><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="1" /><path d="M16 8V4H4v12h4" /></>,
  leaf: <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7" />,
  scissors: <><circle cx="6" cy="7" r="2.5" /><circle cx="6" cy="17" r="2.5" /><path d="m8 8.5 12 9M8 15.5l12-9" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
};

export default function Icon({ name, size = 20, strokeWidth = 1.5, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
