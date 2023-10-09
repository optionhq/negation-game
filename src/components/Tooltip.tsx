import React, { useRef } from 'react';

export default function Tooltip({
  text,
  orientation,
  children,
}: {
  text: string;
  children: React.ReactNode;
  orientation: "left" | "right" | "top" | "bottom";
}) {
  const textRef  = useRef<HTMLDivElement>(null)
  return (
    <div className="group/tooltip inline-block relative group-hover/tooltip:bg-red-800">
      {children}
      <div
      ref={textRef}
        className={`opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible absolute z-10 bg-gray-600 text-white text-sm leading-tight py-2 px-3 rounded-lg transition-opacity duration-200 ease-in-out bottom-full transform flex items-center justify-center w-fit ${
          orientation === "right" ? "left-full translate-y-[28px]" : 
          orientation === "left" ? "-translate-x-full translate-y-[28px]" : ""
        }`}
          style={{
            transform: `${orientation === "top" ? `translateX(calc(-50% + 12px)) translateY(-20%)` :
            orientation === "bottom" ? "translateX(calc(-50% + 12px)) translateY(190%)": ""}`
          }}
        >
        <p  className="w-fit whitespace-nowrap">{text}</p>
        <div
          className={`absolute w-3 h-3 bg-gray-600 transform rotate-45 -mt-1 -z-10 ${
            orientation === "right" ? " -left-1 translate-y-[2.5px]" : 
            orientation === "top" ? "translate-y-[150%]" :
            orientation === "bottom" ? "top-0 -translate-y-[150%]]" :
            orientation === "left" ? "-right-1 translate-y-[2.5px]" : ""
          }`}></div>
      </div>
    </div>
  );
}