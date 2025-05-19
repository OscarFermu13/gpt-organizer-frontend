import React from "react";

export default function FolderList() {
  return (
    <div className="text-white text-sm">
      <p className="mb-2 font-bold">📁 Mis carpetas</p>
      <ul className="space-y-1">
        <li className="hover:bg-gray-700 p-1 rounded cursor-pointer">📝 Proyecto A</li>
        <li className="hover:bg-gray-700 p-1 rounded cursor-pointer">📚 Investigación</li>
      </ul>
    </div>
  );
}
