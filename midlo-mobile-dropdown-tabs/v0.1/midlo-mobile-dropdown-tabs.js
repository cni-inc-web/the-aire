document.addEventListener("click", function (event) {
  const dropdownItem = event.target.closest("[data-dropdown]");
  if (!dropdownItem) return;

  // 1) Switch tab
  const dropdownValue = dropdownItem.getAttribute("data-dropdown");
  const tabElement = document.querySelector(`[data-w-tab="${dropdownValue}"]`);
  if (tabElement) tabElement.click();

  // 2) Replace text
  const dropdownText = dropdownItem.textContent.trim();
  const replaceTextElement = document.querySelector(".replace-text");
  if (replaceTextElement) replaceTextElement.textContent = dropdownText;

  // 3) Close THIS Webflow dropdown
  if (window.jQuery) {
    const $dd = jQuery(dropdownItem).closest(".w-dropdown");
    if ($dd.length) {
      // let the click/tab happen first, then close
      requestAnimationFrame(() => $dd.trigger("w-close"));
      // or: $dd.trigger("w-close.w-dropdown");
    }
  }
});