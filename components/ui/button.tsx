import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline";
};

export function Button({
  className = "",
  variant = "default",
  ...props
}: Props) {
  const styles = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700",
    destructive:
      "bg-red-600 text-white hover:bg-red-700",
    ghost:
      "hover:bg-gray-100 dark:hover:bg-gray-800",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200", // ✅ Added outline
  }[variant];

  return (
    <button
      className={`px-3 py-2 rounded-xl text-sm ${styles} ${className}`}
      {...props}
    />
  );
}
