function initFloatingLabels() {
  const wrappers = document.querySelectorAll(".form-field_wrapper");

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector(".form-field");
    const label = wrapper.querySelector(".form-field_label");

    if (!input || !label) return;

    function toggleLabel() {
      const hasValue =
        input.value &&
        input.value.trim() !== "";

      label.style.display = hasValue ? "none" : "";
    }

    // avoid duplicate listeners
    if (!input.dataset.labelInit) {
      input.addEventListener("input", toggleLabel);
      input.addEventListener("change", toggleLabel);
      input.addEventListener("blur", toggleLabel);

      input.dataset.labelInit = "true";
    }

    toggleLabel();
  });
}

// initial load
document.addEventListener("DOMContentLoaded", () => {
  initFloatingLabels();

  // catches delayed autofill
  setTimeout(initFloatingLabels, 300);
});

// back button / bfcache restore
window.addEventListener("pageshow", () => {
  initFloatingLabels();

  // important for restored form state
  setTimeout(initFloatingLabels, 300);
});