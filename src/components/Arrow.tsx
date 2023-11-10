export default function Arrow() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const path = isIOS ? "M9 6l6 6-6 6" : "M9 6l6 6-6 6";

  return (
    <svg
      fill="none"
      height="24"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24">
      <path d={path}></path>
    </svg>
  );
}