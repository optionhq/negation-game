import React from 'react';

export default function Tooltip({
  text,
  orientation,
  children,
}: {
  text: string;
  children: React.ReactNode;
  orientation: "left" | "right" | "top" | "bottom";
}) {
  return (
    <div className="group inline-block relative">
      {children}
      <div
        className={`opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute z-10 bg-gray-600 text-white text-sm leading-tight py-2 px-3 rounded-lg transition-opacity duration-200 ease-in-out bottom-full transform flex items-center justify-center w-fit ${
          orientation === "right" ? "left-full translate-y-[28px]" : 
          orientation === "top" ? "-translate-y-[25%] -translate-x-[37%]" : 
          orientation === "bottom" ? "translate-y-[200%] -translate-x-[40%]" : 
          orientation === "left" ? "-translate-x-full translate-y-[28px]" : ""
        }`}>
        <p className="w-fit whitespace-nowrap">{text}</p>
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