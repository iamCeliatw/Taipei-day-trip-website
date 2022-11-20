"use strict";

// let overlay = document.querySelector(".overlay");
// let openMenu = document.querySelector(".desk-navbar");
let loadMore = document.querySelector("#loadMore");
let btn = document.querySelector(".btn");

let close = document.querySelector(".close");
let greenBar = document.querySelector(".greenBar");
let dialog = document.querySelector("#dialog");
let deskOverlay = document.querySelector(".lay");

function showDialog() {
  greenBar.style.display = "block";
  dialog.style.display = "block";
  deskOverlay.classList.remove("hide");
}

function closeDialog() {
  greenBar.style.display = "none";
  dialog.style.display = "none";
  deskOverlay.classList.add("hide");
}

// btn.addEventListener("click", function () {
//   openMenu.classList.remove("hidden");
//   overlay.classList.remove("hidden");
// });
// overlay.addEventListener("click", function () {
//   openMenu.classList.add("hidden");
//   overlay.classList.add("hidden");
// });

//fetch
fetch(
  "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment.json"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //把已取資料呈現至畫面
    let spot = data.result.results;
    let lens = spot.length;
    console.log(lens);
    //選取class
    for (let x = 0; x < lens - 12; x++) {
      let spotUl = document.querySelector(".spotlist");
      let liItem = document.createElement("li");
      liItem.classList.add("spot", "hid");
      spotUl.appendChild(liItem);
    }

    for (let i = 0; i < lens; i++) {
      let el = document.querySelectorAll(".spot");
      let imgItem = document.createElement("img");
      imgItem.setAttribute(
        "src",
        spot[i].file.toLowerCase().split("jpg")[0] + "jpg"
      );
      let item = document.createElement("div");
      item.textContent = spot[i].stitle;
      el[i].appendChild(imgItem);
      el[i].appendChild(item);
    }
  });

function showMore() {
  let hide_el = document.querySelectorAll(".hid");
  let each_item = Array.from(hide_el).slice(0, 8);
  console.log(hide_el.length);
  each_item.forEach((Element) => {
    Element.classList.remove("hid");
  });

  if (hide_el.length === 6) {
    hideShowMoreButton();
  }
}
function hideShowMoreButton() {
  document.getElementById("hid_a").classList.add("hid");
}
