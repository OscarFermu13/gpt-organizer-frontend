import { createRoot } from 'react-dom/client'
import React from 'react';
import FolderList from './components/folderList/folderList';
import CreateButton from './components/createButton';
import AuthPanel from './components/authPanel';
import UpgradePanel from './components/upgradePanel';
import ChatToggle from './components/chatToggle';

const API_URL = 'https://gpt-organizer-backend.onrender.com';

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
    "M11.3312 3.56837C12.7488 2.28756 14.9376 2.33009 16.3038 3.6963L16.4318 3.83106C17.6712 5.20294 17.6712 7.29708 16.4318 8.66895L16.3038 8.80372L10.0118 15.0947C9.68833 15.4182 9.45378 15.6553 9.22179 15.8457L8.98742 16.0225C8.78227 16.1626 8.56423 16.2832 8.33703 16.3828L8.10753 16.4756C7.92576 16.5422 7.73836 16.5902 7.5216 16.6348L6.75695 16.7705L4.36339 17.169C4.22053 17.1928 4.06908 17.2188 3.94054 17.2285C3.84177 17.236 3.70827 17.2386 3.56261 17.2031L3.41417 17.1543C3.19115 17.0586 3.00741 16.8908 2.89171 16.6797L2.84581 16.5859C2.75951 16.3846 2.76168 16.1912 2.7716 16.0596C2.7813 15.931 2.80736 15.7796 2.83117 15.6367L3.2296 13.2432L3.36437 12.4785C3.40893 12.2616 3.45789 12.0745 3.52453 11.8926L3.6173 11.6621C3.71685 11.4352 3.83766 11.2176 3.97765 11.0127L4.15343 10.7783C4.34386 10.5462 4.58164 10.312 4.90538 9.98829L11.1964 3.6963L11.3312 3.56837ZM5.84581 10.9287C5.49664 11.2779 5.31252 11.4634 5.18663 11.6162L5.07531 11.7627C4.98188 11.8995 4.90151 12.0448 4.83507 12.1963L4.77355 12.3506C4.73321 12.4607 4.70242 12.5761 4.66808 12.7451L4.54113 13.4619L4.14269 15.8555L4.14171 15.8574H4.14464L6.5382 15.458L7.25499 15.332C7.424 15.2977 7.5394 15.2669 7.64953 15.2266L7.80285 15.165C7.95455 15.0986 8.09947 15.0174 8.23644 14.9238L8.3839 14.8135C8.53668 14.6876 8.72225 14.5035 9.0714 14.1543L14.0587 9.16602L10.8331 5.94044L5.84581 10.9287ZM15.3634 4.63673C14.5281 3.80141 13.2057 3.74938 12.3097 4.48048L12.1368 4.63673L11.7735 5.00001L15.0001 8.22559L15.3634 7.86329L15.5196 7.68946C16.2015 6.85326 16.2015 5.64676 15.5196 4.81056L15.3634 4.63673Z"

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

function insertSidebarToggleComponent() {
  const history = document.getElementById('history');
  const folderList = document.getElementById('gpt-organizer-folderlist-root');
  const aside = history?.querySelector('aside');
  const heading = aside.querySelector('h2');

  if (heading) heading.remove();
  if (!history || !folderList || !aside || document.getElementById('sidebar-toggle-wrapper')) return;

  aside.classList.remove('mt-(--sidebar-section-margin-top)');

  // Crear contenedor
  const container = document.createElement('div');
  container.id = 'sidebar-toggle-wrapper';
  folderList.insertAdjacentElement('afterend', container);

  // Montar componente React
  const root = createRoot(container);
  root.render(<ChatToggle />);
}

(async () => {
  try {
    const history = await waitForElement('#history');

    const container = document.createElement('div');
    container.id = 'gpt-organizer-folderlist-root';

    if (!document.querySelector('#gpt-organizer-folderlist-root')) {
      history.prepend(container);
      const root = createRoot(container);

      const res = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        credentials: 'include',
      });

      const billingRes = await fetch(`${API_URL}/billing/status`, {
        method: 'GET',
        credentials: 'include',
      });

      const isAuthenticated = res.ok;

      const status = await billingRes.json();
      const isFreeUser = status.plan === 'pro' ? false : true;
      const trialEnded = new Date(status.trialEndsAt) < new Date();

      if (isAuthenticated) {
        if (isFreeUser && trialEnded)
          root.render(<UpgradePanel />);
        else
          root.render(<FolderList />);
      } else 
        root.render(<AuthPanel />);

      observeMenuOpen();
      insertSidebarToggleComponent();
    }
  } catch (error) {
    console.error('GPT Organizer: Failed to inject');
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