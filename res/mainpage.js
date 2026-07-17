function openEmbeddedLink(event) {
  const element = event.target.closest('[data-href]');

  if (!element) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  window.location.assign(element.dataset.href);
  return true;
}

document.addEventListener('click', function (event) {
  openEmbeddedLink(event);
});

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  openEmbeddedLink(event);
});
