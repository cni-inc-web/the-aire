//console.log("TIMED HOVER SCRIPT ACTIVE");

setInterval(() => {
  const buttons = document.querySelectorAll(".new-button");
  //console.log("Buttons found:", buttons.length);

  buttons.forEach(btn => {
    btn.classList.add("timed-hover");  // add timed border
    //console.log("Added timed-hover");

    setTimeout(() => {
      btn.classList.remove("timed-hover"); // remove after 1s
      //console.log("Removed timed-hover");
    }, 1000);
  });
}, 10000);