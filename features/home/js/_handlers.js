function bindTabGroup(tabs, container) {
  if (!tabs.length || !container) return;
  const cards = [...container.querySelectorAll('[data-topic]')];

  function filter(topic) {
    tabs.forEach(t => t.classList.remove('is-active'));
    const active = [...tabs].find(t => t.textContent.trim() === topic);
    if (active) active.classList.add('is-active');

    let visible = 0;
    cards.forEach(card => {
      if (topic === 'Semua Topik' || card.dataset.topic === topic) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    let emptyEl = container.querySelector('.home-forum-empty');
    if (visible === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('p');
        emptyEl.className = 'home-forum-empty';
        emptyEl.textContent = 'Tidak ada forum untuk topik ini';
        container.appendChild(emptyEl);
      }
    } else if (emptyEl) {
      emptyEl.remove();
    }
  }

  tabs.forEach(tab =>
    tab.addEventListener('click', () => filter(tab.textContent.trim()))
  );
}

export function bindTopicTabs(el) {
  bindTabGroup(
    el.querySelectorAll('.home-topic'),
    el.querySelector('.home-forum-list')
  );
  bindTabGroup(
    el.querySelectorAll('.m-home-topic'),
    el.querySelector('.m-home-forum-list')
  );
}
