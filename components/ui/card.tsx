
import React from "react";
export function Card({ children, className = "" }: any){ return <div className={`rounded-2xl border bg-white dark:bg-gray-900 shadow-sm ${className}`}>{children}</div>; }
export function CardHeader({ children, className = "" }: any){ return <div className={`p-4 border-b dark:border-gray-800 ${className}`}>{children}</div>; }
export function CardContent({ children, className = "" }: any){ return <div className={`p-4 ${className}`}>{children}</div>; }
export function CardTitle({ children, className = "" }: any){ return <h3 className={`text-base font-semibold ${className}`}>{children}</h3>; }
