import { createRoot } from 'react-dom/client'
import React from 'react'
import FolderList from './FolderList'
import CreateButton from './CreateButton';
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

function observeMenuOpen() {
  const menuSelector = '[role="menu"][data-radix-menu-content]';
  const menuItemClass = 'touch:min-h-10 group relative mx-1.5 my-0 flex can-hover:cursor-pointer items-center rounded-[10px] py-2 px-2.5 text-sm select-none';

  const observer = new MutationObserver(() => {
    const menu = document.querySelector(menuSelector);
    if (menu && !menu.querySelector('.custom-menu-item')) {
      const newItem = document.createElement('div');
      newItem.className = menuItemClass + ' custom-menu-item';
      newItem.role = 'menuitem';
      
      menu.prepend(newItem);

      const root = createRoot(newItem);
      root.render(<CreateButton />);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

(async () => {
  try {
    //const target = await waitForElement('#late-load-sidebar-items');
    const history = await waitForElement('#history');

    const container = document.createElement('div');
    container.id = 'gpt-organizer-folderlist-root';

    // Evita inyecciones múltiples si recargas el script
    if (!document.querySelector('#gpt-organizer-folderlist-root')) {
      //target.insertBefore(container, history);
      history.prepend(container);
      const root = createRoot(container);
      root.render(<FolderList />);
      observeMenuOpen();
    }
  } catch (error) {
    console.error('GPT Organizer: Failed to inject FolderList', error);
  }
})();

// Extraer el href del menú

function getThreeDotsButtons() {
  return document.querySelectorAll('button[data-testid$="-options"]');
}

function findClosestHrefAndTitle(element) {
  if (!element) return { href: null, title: null };

  let current = element;
  while (current && current !== document.body) {
    if (current.tagName === "A" && current.href) {
      const titleSpan = current.querySelector("span");
      const title = titleSpan ? titleSpan.textContent.trim() : null;
      return { href: current.href, title };
    }

    const innerLink = current.querySelector("a[href]");
    if (innerLink) {
      const titleSpan = innerLink.querySelector("span");
      const title = titleSpan ? titleSpan.textContent.trim() : null;
      return { href: innerLink.href, title };
    }

    current = current.parentElement;
  }

  return { href: null, title: null };
}

function attachListenersToThreeDotsButtons() {
  const buttons = getThreeDotsButtons();

  buttons.forEach((btn) => {
    if (!btn.dataset.listenerAttached) {
      btn.dataset.listenerAttached = "true";

      btn.addEventListener("click", () => {
        const { href, title } = findClosestHrefAndTitle(btn);
        if (href) {
          console.log("📎 Chat href guardado:", href);
          console.log("📝 Chat título guardado:", title);
          sessionStorage.setItem("lastChatHref", href);
          sessionStorage.setItem("lastChatTitle", title || "");
        }
      });
    }
  });
}

// Observar DOM dinámico
const observer = new MutationObserver(() => {
  attachListenersToThreeDotsButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

// Run once at load
attachListenersToThreeDotsButtons();