import { createRoot } from 'react-dom/client'
import React from 'react'
import FolderList from './FolderList'
import './style.css'

function injectUI() {
  const sidebar = document.querySelector("late-load-sidebar-items");
  if (!sidebar) return;

  if (document.getElementById("gpt-folder-list")) return;

  const container = document.createElement("div");
  container.id = "gpt-folder-list";
  container.className = "mb-2 p-2 border-b border-gray-700";
  sidebar.prepend(container);

  const root = createRoot(container);
  root.render(<FolderList />);
}

injectUI();
