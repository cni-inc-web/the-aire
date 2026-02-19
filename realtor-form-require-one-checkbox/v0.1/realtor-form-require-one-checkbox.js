document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#realtor-form");
  if (!form) return;

  const ids = [
    "Townhome-HHHunt-Homes",
    "Condo-Main-Street-Homes",
    "Townhome-Eagle-Construction"
  ];

  const checkboxes = ids
    .map(id => form.querySelector(`#${CSS.escape(id)}`))
    .filter(Boolean);

  if (!checkboxes.length) return;

  const first = checkboxes[0];
  const anyChecked = () => checkboxes.some(cb => cb.checked);

  function blockSubmit(e) {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    first.setCustomValidity("Please select at least one option.");
    first.reportValidity?.();
    first.focus({ preventScroll: false });
    return false;
  }

  form.addEventListener("submit", function (e) {
    if (!anyChecked()) return blockSubmit(e);
    first.setCustomValidity("");
  }, true);

  const submitButtons = form.querySelectorAll("[type='submit'], button[type='submit']");
  submitButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      if (!anyChecked()) return blockSubmit(e);
      first.setCustomValidity("");
    }, true);
  });

  checkboxes.forEach(cb => cb.addEventListener("change", () => first.setCustomValidity("")));
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !anyChecked()) return blockSubmit(e);
  }, true);
});
