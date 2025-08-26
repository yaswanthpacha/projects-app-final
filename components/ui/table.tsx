
import React from "react";
export function Table({ children }: any){ return <table className="min-w-full text-sm">{children}</table>; }
export function TableHeader({ children }: any){ return <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>; }
export function TableRow({ children }: any){ return <tr className="text-left border-t dark:border-gray-800">{children}</tr>; }
export function TableHead({ children }: any){ return <th className="px-3 py-2">{children}</th>; }
export function TableBody({ children }: any){ return <tbody>{children}</tbody>; }
export function TableCell({ children }: any){ return <td className="px-3 py-2">{children}</td>; }
