import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-full px-6 py-2.5 font-semibold shadow-sm transition-all duration-300",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:shadow-sm",
        className
      )}
    >
      {children}
    </button>
  );
}
