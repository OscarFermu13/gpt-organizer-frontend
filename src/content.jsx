import { createRoot } from 'react-dom/client'
import React from 'react'
import FolderList from './FolderList'
import CreateButton from './CreateButton';
import AuthPanel from './AuthPanel';
import './style.css'

const API_URL = 'https://gpt-organizer-backend.onrender.com/auth';

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

  const targetPathD =
    "M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588 19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441 20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288 15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428 5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993 17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z";

  const observer = new MutationObserver(() => {
    const menus = document.querySelectorAll(menuSelector);

    menus.forEach((menu) => {
      const hasTargetPath = menu.querySelector(`path[d="${targetPathD}"]`);
      const alreadyInjected = menu.querySelector('.custom-menu-item');

      if (hasTargetPath && !alreadyInjected) {
        const newItem = document.createElement('div');
        newItem.className = `${menuItemClass} custom-menu-item`;
        newItem.role = 'menuitem';

        menu.prepend(newItem);

        const root = createRoot(newItem);
        root.render(<CreateButton />);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

(async () => {
  try {
    const history = await waitForElement('#history');

    const container = document.createElement('div');
    container.id = 'gpt-organizer-folderlist-root';

    if (!document.querySelector('#gpt-organizer-folderlist-root')) {
      history.prepend(container);
      const root = createRoot(container);

      const res = await fetch(`${API_URL}/validate`, {
        method: 'GET',
        credentials: 'include',
      });

      const isAuthenticated = res.ok;

      if (isAuthenticated)
        root.render(<FolderList />);
      else
        root.render(<AuthPanel />);

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