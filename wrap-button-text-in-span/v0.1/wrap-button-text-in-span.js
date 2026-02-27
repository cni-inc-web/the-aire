document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("a.new-button.w-button");

  buttons.forEach(button => {
    // Loop through child nodes to find text nodes
    button.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
        const span = document.createElement("span");
        span.textContent = node.textContent.trim();
        node.replaceWith(span);
      }
    });
  });
});