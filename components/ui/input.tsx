
import React from "react";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={`border rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 ${props.className||""}`} />;
}
