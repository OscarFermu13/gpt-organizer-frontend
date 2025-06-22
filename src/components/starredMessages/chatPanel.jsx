import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSavedMessages } from './hooks/useStarredMessages';
import { getTranslator } from '../../lib/i18n';
import ListStarredMessages from './listStarredMessages';

const t = getTranslator();

export default function ChatPanel({ chatId }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(null);
  const [title, setTitle] = useState('');
  const { savedMessages, saveMessage, deleteMessage } = useSavedMessages(chatId);
  const observerRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    const handleUpdate = (event) => {
      if (event.detail.state === 'open')
        setDrawerOpen(true);
    };
    window.addEventListener('messagesUpdated', handleUpdate);
    return () => window.removeEventListener('messagesUpdated', handleUpdate);
  }, []);

  const handleSave = async (messageIndex, text) => {
    await saveMessage(messageIndex, text);
    setDrawerOpen(true);
  };

  const handleDelete = async (messageIndex) => {
    const msg = savedMessages.find(m => m.messageIndex === messageIndex);
    if (msg) {
      await deleteMessage(msg.id);
    }
  };

  const handleScrollTo = (messageIndex) => {
    const el = document.querySelector(`[data-testid="conversation-turn-${messageIndex}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openModal = useCallback((messageIndex) => {
    setCurrentMessageIndex(messageIndex);
    setShowCreateModal(true);
  }, []);

  const deleteMsg = useCallback((messageIndex) => {
    handleDelete(messageIndex);
  }, [handleDelete]);

  const updateButtons = useCallback(() => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const thread = document.getElementById('thread');
    if (!thread) {
      isUpdatingRef.current = false;
      return;
    }

    const savedIndices = new Set(savedMessages.map(msg => msg.messageIndex));
    const articles = thread.querySelectorAll('article[data-testid^="conversation-turn-"]');

    articles.forEach((article) => {
      const testId = article.getAttribute('data-testid');
      const match = testId?.match(/conversation-turn-(\d+)/);
      if (!match) return;

      const index = parseInt(match[1], 10);
      //if (index % 2 !== 0) return;

      const targetDiv = Array.from(article.querySelectorAll('div')).find(div =>
        div.className.includes('flex flex-wrap items-center') &&
        div.className.includes('gap-y-4') &&
        div.className.includes('group-hover/turn-messages')
      );

      if (!targetDiv) return;

      let existingBtn = targetDiv.querySelector('.gpt-organizer-btn');
      const isSaved = savedIndices.has(index);

      if (existingBtn) {
        const currentlyFilled = existingBtn.querySelector('svg').getAttribute('fill') === 'white';
        if (currentlyFilled !== isSaved) {
          updateButtonState(existingBtn, isSaved, index);
        }
      } else {
        const btn = createButton(isSaved, index);
        targetDiv.prepend(btn);
      }
    });

    isUpdatingRef.current = false;
  }, [savedMessages, handleSave, handleDelete]);

  const createButton = (isSaved, index) => {
    const btn = document.createElement('button');
    btn.className = 'gpt-organizer-btn text-token-text-secondary hover:bg-token-bg-secondary rounded-lg';
    btn.style.pointerEvents = 'auto';

    updateButtonState(btn, isSaved, index);
    return btn;
  };

  const updateButtonState = (btn, isSaved, index) => {
    btn.title = isSaved ? t.save_message_modal.delete_btn_title : t.save_message_modal.save_btn_title;
    btn.onclick = isSaved
      ? () => deleteMsg(index)
      : () => {
        openModal(index);
        console.log("test");
      };

    let span = btn.querySelector('span');
    if (!span) {
      span = document.createElement('span');
      span.className = 'touch:w-10 flex h-8 w-8 items-center justify-center';
      btn.appendChild(span);
    }

    span.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${isSaved ? 'white' : 'none'}" stroke="currentColor" stroke-width="2" class="icon">
        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  };

  useEffect(() => {
    const thread = document.getElementById('thread');
    if (!thread) return;

    let timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateButtons, 100);
    };

    const observer = new MutationObserver((mutations) => {
      const relevantMutations = mutations.filter(mutation => {
        if (mutation.target.classList?.contains('gpt-organizer-btn')) return false;

        return Array.from(mutation.addedNodes).some(node =>
          node.nodeType === 1 &&
          node.getAttribute?.('data-testid')?.includes('conversation-turn-')
        );
      });

      if (relevantMutations.length > 0) {
        debouncedUpdate();
      }
    });

    observer.observe(thread, {
      childList: true,
      subtree: false
    });

    observerRef.current = observer;

    updateButtons();

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [updateButtons]);

  useEffect(() => {
    const container = document.getElementById('conversation-header-actions');
    if (!container) return;

    let btn = container.querySelector('.gpt-organizer-open-messages-btn');
    
    if (!btn) {
      btn = document.createElement('button');
      span = document.createElement('span');
      span.className = 'flex h-6 w-6 items-center justify-center';
        
      span.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      `;

      btn.appendChild(span);
      btn.className = 'gpt-organizer-open-messages-btn btn relative btn-ghost text-token-text-primary';

      container.prepend(btn);
    }

    const updateButton = () => {
      btn.onclick = () => setDrawerOpen(!isDrawerOpen);
    }

    updateButton();
  }, [isDrawerOpen]);

  return (
    <>
      <ListStarredMessages
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        savedMessages={savedMessages}
        onSelect={handleScrollTo}
        onDelete={deleteMessage}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80" onClick={() => setShowCreateModal(false)}>
          <div
            className="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,1fr)_auto_minmax(10px,1fr)] md:grid-rows-[minmax(20px,1fr)_auto_minmax(20px,1fr)]"
          >
            <div
              className="p-4 sm:p-6 popover bg-token-main-surface-primary relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full text-start ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl shadow-xl flex flex-col focus:outline-hidden overflow-hidden max-w-[550px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="pb-4 text-lg font-bold">{t.save_message_modal.title}</h2>
              <input
                type="text"
                placeholder={t.save_message_modal.name_placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-token-main-surface-primary w-full resize-none focus:ring-transparent rounded-lg border text-sm focus-token-border-heavy border-token-border-default placeholder:text-gray-400 placeholder:text-gray-300"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowCreateModal(false)} className="btn relative btn-secondary ms-4 me-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3">
                  {t.save_message_modal.btn_cancel}
                </button>
                <button
                  onClick={() => {
                    handleSave(currentMessageIndex, title);
                    setShowCreateModal(false);
                    setTitle('');
                  }}
                  className="btn relative btn-primary ms-4 me-0 mt-0 rounded-full px-4 py-1 text-base font-bold sm:py-3"
                  disabled={!title.trim()}>
                  {t.save_message_modal.btn_save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}