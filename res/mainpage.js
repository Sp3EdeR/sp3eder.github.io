function openStoreBadgeLink(event) {
  const badge = event.target.closest('[data-store-link]');

  if (!badge) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  window.location.assign(badge.dataset.storeLink);
  return true;
}

document.addEventListener('click', function (event) {
  openStoreBadgeLink(event);
});

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  openStoreBadgeLink(event);
});
