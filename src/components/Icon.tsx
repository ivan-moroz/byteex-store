import type { ContentItem } from '@/lib/content-schema';
export function Icon({ name }: { name: ContentItem['icon'] }) {
  const paths = {
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    leaf: (
      <>
        <path d="M19 4C8 2 2 9 7 16s15 1 12-12ZM6 19 16 9M9 15v-5m4 1h4" />
      </>
    ),
    waves: (
      <>
        <path d="M3 6c3-5 6 5 9 0s6 5 9 0M3 12c3-5 6 5 9 0s6 5 9 0M3 18c3-5 6 5 9 0s6 5 9 0" />
      </>
    ),
    cart: (
      <>
        <path d="M1 3h3l3 13h9l3-10H7M12 20c0-5 5-6 9-5 0 5-4 8-9 5Zm0 0 5-3" />
        <circle cx="8" cy="20" r="1" />
      </>
    ),
    truck: (
      <>
        <path d="M2 5h12v12H2V5Zm12 4h5l4 5v3h-9M1 9h7M0 13h5" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    cloud: (
      <>
        <path d="M6 17a5 5 0 1 1 1-10 6 6 0 0 1 11 2 4 4 0 1 1 0 8Z" />
        <path d="M8 12h1m3 0h1m3 0h1" />
      </>
    ),
    water: (
      <>
        <path d="M12 2S4 10 4 15a8 8 0 0 0 16 0C20 10 12 2 12 2Z" />
        <path d="M8 15a4 4 0 0 0 4 4" />
      </>
    ),
    bolt: <path d="m14 1-10 13h7l-1 9 10-14h-7l1-8Z" />,
  };
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
