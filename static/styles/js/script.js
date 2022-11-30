"use strict";

let ct = 0;
let page = 0;
let isLoad = false;
let keyword;
let url;
let lens;

let btn = document.querySelector(".btn");
let close = document.querySelector(".close");
let greenBar = document.querySelector(".greenBar");
let dialog = document.querySelector("#dialog");

let deskOverlay = document.querySelector(".lay");
let spotInput = document.querySelector("#spotInput");
let catPlace = document.querySelector(".catPlace");
let main = document.querySelector(".main");

let spotList = document.querySelector(".list");
let spot = document.querySelector(".spot");
let noItem = document.createElement("div");
let footer = document.querySelector(".footer");

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

function spotSearch() {
  catPlace.style.display = "flex";
  let cat = catPlace.getElementsByTagName("span");
  for (let i = 0; i < cat.length; i++) {
    let currentObj = cat[i];
    currentObj.onclick = function () {
      spotInput.value = currentObj.textContent;
      catPlace.style.display = "none";
    };
  }
  document.addEventListener("mouseup", function (e) {
    if (!catPlace.contains(e.target)) {
      catPlace.style.display = "none";
    }
  });
}

window.addEventListener("load", (e) => {
  console.log("網頁已加載成功");
  fetch(`${location.href}/api/categories`)
    .then((res) => res.json())
    .then((data) => {
      let lens = data.data.length;
      for (let i = 0; i < lens; i++) {
        let spanItem = document.createElement("span");
        spanItem.classList.add("catItem");
        spanItem.textContent = data.data[i];
        catPlace.appendChild(spanItem);
      }
    });
  getData();
});
function getData() {
  try {
    isLoad = true;
    // console.log("before fetch", isLoad);
    if (keyword) {
      url = `${location.href}/api/attractions?page=${page}&keyword=${keyword} `;
    } else {
      url = `${location.href}/api/attractions?page=${page}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);

        if (data.data.length === 0) {
          noItem.replaceChildren();
          noItem.classList.add("noItem");
          noItem.textContent = "There is no result !!";
          main.appendChild(noItem);
        } else {
          noItem.replaceChildren();
          // nextPage = data.nextPage;
          let result = data.data;
          lens = data.data.length;
          // console.log(lens);
          for (let i = 0; i < lens; i++) {
            let aItem = document.createElement("a");
            let liItem = document.createElement("div");
            let imgItem = document.createElement("img");
            let nameItem = document.createElement("a");
            let mrtCat = document.createElement("div");
            aItem.setAttribute("href", `/attraction/${result[i].id}`);
            nameItem.setAttribute("href", `/attraction/${result[i].id}`);
            liItem.classList.add("spot");
            spotList.appendChild(liItem);
            let box = document.createElement("div");
            box.classList.add("box");
            liItem.appendChild(box);
            imgItem.setAttribute("src", result[i].image[0]);
            imgItem.classList.add("imgItem");
            nameItem.classList.add("nameItem");
            nameItem.setAttribute("id", result[i].id);
            mrtCat.classList.add("mrtItem");
            nameItem.textContent = result[i].name;
            box.appendChild(aItem);
            aItem.appendChild(imgItem);
            box.appendChild(nameItem);
            box.appendChild(mrtCat);
            //   console.log(mrtCat);
            let mrt = document.createElement("span");
            let cat = document.createElement("span");
            mrt.textContent = result[i].mrt;
            mrt.classList.add("mrt");
            cat.textContent = result[i].cat;
            cat.classList.add("cat");
            mrtCat.append(mrt);
            mrtCat.append(cat);
          }
          page = data.nextPage;

          isLoad = false;
          // console.log("123", isLoad);
          lens = data.data.length;
        }
      });
    // console.log(page);
  } catch (error) {
    // console.log(`Error: ${error}`);
  }
}

//點擊搜尋按鈕 觸發search
function search() {
  page = 0;
  keyword = spotInput.value;

  let spotList = document.querySelector(".list");

  spotList.replaceChildren();
  getData();
}

let options = {
  root: null, // document viewport
  rootMargin: "0px",
  threshold: 0.3, // 進入畫面的比例
};
//創建一個observer
let observer = new IntersectionObserver(callback, options);
//觀察footer
observer.observe(footer);
// callback
function callback(entires) {
  //   observer.observe(footer);
  if (entires[0].isIntersecting) {
    ct++;
    if (ct > 1) {
      if (!isLoad && page) {
        getData();
        observer.observe(footer);
      }
    }
  }
}
