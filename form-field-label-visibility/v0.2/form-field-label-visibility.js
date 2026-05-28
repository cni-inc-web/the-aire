function initFloatingLabels() {
  const wrappers = document.querySelectorAll(".form-field_wrapper");

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector(".form-field");
    const label = wrapper.querySelector(".form-field_label");

    if (!input || !label) return;

    function toggleLabel() {
      if (input.value && input.value.trim() !== "") {
        label.style.display = "none";
      } else {
        label.style.display = "";
      }
    }

    input.addEventListener("input", toggleLabel);
    input.addEventListener("blur", toggleLabel);

    // important: run on init for autofill + back navigation
    toggleLabel();
  });
}

// normal page load
document.addEventListener("DOMContentLoaded", initFloatingLabels);

// handles back/forward cache (THIS is the missing piece)
window.addEventListener("pageshow", initFloatingLabels);