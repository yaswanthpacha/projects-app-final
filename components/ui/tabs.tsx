
import React, { useState } from "react";
export function Tabs({ defaultValue, children }: any){
  const [value, setValue] = useState(defaultValue);
  return React.Children.map(children, (child: any) => React.cloneElement(child, { value, setValue }));
}
export function TabsList({ children, value, setValue }: any){
  return <div className="inline-flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">{React.Children.map(children, (child: any)=> React.cloneElement(child, { value, setValue }))}</div>;
}
export function TabsTrigger({ children, value: myValue, value, setValue }: any){
  const active = myValue === value;
  return <button onClick={()=>setValue(myValue)} className={`px-4 py-2 rounded-xl text-sm ${active ? "bg-white dark:bg-gray-900 shadow border dark:border-gray-800" : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-900/40"}`}>{children}</button>;
}
export function TabsContent({ children, value: myValue, value }: any){
  if (myValue !== value) return null;
  return <div className="mt-4">{children}</div>;
}
