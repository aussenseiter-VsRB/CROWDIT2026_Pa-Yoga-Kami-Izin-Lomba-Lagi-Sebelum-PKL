export function bindTopicTabs(el) {
  const desktopBtns = el.querySelectorAll('.home-topic');
  desktopBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      desktopBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  const mobileBtns = el.querySelectorAll('.m-home-topic');
  mobileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mobileBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
}
