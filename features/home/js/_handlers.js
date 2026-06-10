let _currentTopic = 'Semua Topik';
let _currentStatus = '';

function applyFilter(container) {
  const cards = [...container.querySelectorAll('[data-topic]')];

  let visible = 0;
  cards.forEach(card => {
    const matchTopic = _currentTopic === 'Semua Topik' || card.dataset.topic === _currentTopic;
    const matchStatus = !_currentStatus || card.dataset.status === _currentStatus;
    if (matchTopic && matchStatus) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  let emptyEl = container.querySelector('.home-filter-empty');
  if (visible === 0) {
    if (!emptyEl) {
      emptyEl = document.createElement('p');
      emptyEl.className = 'home-filter-empty';
      emptyEl.textContent = 'Tidak ada forum untuk filter ini';
      container.appendChild(emptyEl);
    }
  } else if (emptyEl) {
    emptyEl.remove();
  }
}

function bindTabGroup(tabs, container) {
  if (!tabs.length || !container) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      _currentTopic = tab.textContent.trim();
      applyFilter(container);
    });
  });
}

function bindStatusChips(chips, container) {
  if (!chips.length || !container) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      _currentStatus = chip.dataset.status || '';
      applyFilter(container);
    });
  });
}

export function bindTopicTabs(el) {
  const deskCards = el.querySelector('.home-forum-list');
  bindTabGroup(el.querySelectorAll('.home-topic'), deskCards);
  bindStatusChips(el.querySelectorAll('.home-status-chip'), deskCards);

  const mobCards = el.querySelector('.m-home-forum-list');
  bindTabGroup(el.querySelectorAll('.m-home-topic'), mobCards);
  bindStatusChips(el.querySelectorAll('.m-home-status-chip'), mobCards);
}
