document.addEventListener("DOMContentLoaded", function () {
  const wrappers = document.querySelectorAll(".form-field_wrapper");

  wrappers.forEach(wrapper => {
    const input = wrapper.querySelector(".form-field");
    const label = wrapper.querySelector(".form-field_label");

    if (!input || !label) return;

    function toggleLabel() {
      if (input.value.trim() !== "") {
        label.style.display = "none";
      } else {
        label.style.display = "";
      }
    }

    // When user types
    input.addEventListener("input", toggleLabel);

    // When user leaves field
    input.addEventListener("blur", toggleLabel);

    // Run once on load (handles autofill)
    toggleLabel();
  });
});