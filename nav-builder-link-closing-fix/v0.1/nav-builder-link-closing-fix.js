document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('.nav_hamburger-menu');
  const checkbox = document.querySelector('.hamburger input');
  const webflowButton = document.querySelector('.w-nav-button');

  if (!menu || !webflowButton) return;

  menu.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const url = new URL(link.href, window.location.origin);
    const isSamePage =
      url.pathname === window.location.pathname &&
      url.hash;

    if (!isSamePage) return;

    setTimeout(function () {
      if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (webflowButton.classList.contains('w--open')) {
        webflowButton.click();
      }
    }, 0);
  });
});