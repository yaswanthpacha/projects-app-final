
import React, { useEffect, useRef } from "react";
export function Dialog({ open, onOpenChange, children }: any){
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const el = ref.current!;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    const handler = () => onOpenChange && onOpenChange(el.open);
    el.addEventListener("close", handler);
    return () => el.removeEventListener("close", handler);
  },[open]);
  return <dialog ref={ref} className="rounded-2xl p-0 w-[90vw] max-w-3xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">{children}</dialog>;
}
export function DialogHeader({ children }: any){ return <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">{children}</div>; }
export function DialogContent({ children }: any){ return <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>; }
export function DialogFooter({ children }: any){ return <div className="p-3 border-t dark:border-gray-800 flex justify-end gap-2">{children}</div>; }
