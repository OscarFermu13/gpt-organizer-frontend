import { createRoot } from 'react-dom/client'
import React from 'react'
import FolderList from './FolderList'
import './style.css'

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;

    const checkExist = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkExist);
        resolve(element);
      } else if (elapsed >= timeout) {
        clearInterval(checkExist);
        reject(new Error(`Element ${selector} not found after ${timeout}ms`));
      }
      elapsed += interval;
    }, interval);
  });
}

(async () => {
  try {
    const target = await waitForElement('#late-load-sidebar-items');
    const history = await waitForElement('#history');

    const container = document.createElement('div');
    container.id = 'gpt-organizer-folderlist-root';

    // Evita inyecciones múltiples si recargas el script
    if (!document.querySelector('#gpt-organizer-folderlist-root')) {
      target.insertBefore(container, history);
      const root = createRoot(container);
      root.render(<FolderList />);
    }
  } catch (error) {
    console.error('GPT Organizer: Failed to inject FolderList', error);
  }
})();