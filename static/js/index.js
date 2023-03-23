"use strict";

let ct = 0;
let page = 0;
let isLoad = false;
let keyword;
let url;
let lens;

const btn = document.querySelector(".btn");
const close = document.querySelector(".close");
const signinPlace = document.querySelector("#signinPlace");
const signupPlace = document.querySelector("#signupPlace");

const lay = document.querySelector(".lay");
const spotInput = document.querySelector("#spotInput");
const catPlace = document.querySelector(".catPlace");
const main = document.querySelector(".main");

const spotList = document.querySelector(".list");
const spot = document.querySelector(".spot");
const footer = document.querySelector(".footer");
const signinBtn = document.querySelector("#signinBtn");
const signupBtn = document.querySelector("#signupBtn");
const signinPassword = document.querySelector("#signinPassword");
const signupPassword = document.querySelector("#signupPassword");
const signinText = document.querySelector(".signinText");
const msg = document.querySelector(".msg");
const signinMsg = document.querySelector(".signinMsg");
const signupMsg = document.querySelector(".signupMsg");
const reservationText = document.querySelector(".reservationText");
const noItem = document.createElement("img");
const fas = document.querySelectorAll(".fas");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const userIcon = document.querySelector(".usericon");
window.addEventListener("load", () => {
  console.log("網頁已加載成功");
  fetch(`${location.href}api/categories`)
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
  getUser();
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let signupName = document.querySelector("#signupName").value;
  let signupEmail = document.querySelector("#signupEmail").value;
  let signupPassword = document.querySelector("#signupPassword").value;
  fetch(`${location.href}api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        signupMsg.style.display = "block";
        signupMsg.style.color = "red";
        signupMsg.textContent = data.message;
        window.setTimeout(hideMsg, 2000);
      } else {
        console.log(data);
        signupMsg.style.display = "block";
        signupMsg.textContent = data.message;
        signupMsg.style.color = "green";
      }
    });
});

signinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let signinEmail = document.querySelector("#signinEmail").value;
  let signinPassword = document.querySelector("#signinPassword").value;
  fetch(`${location.href}/api/user/auth`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: signinEmail, password: signinPassword }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        signinMsg.style.display = "block";
        signinMsg.textContent = data.message;
        window.setTimeout(hideMsg, 2000);
      } else {
        closeSignDialog();
        signinText.classList.add("hide");
        userIcon.classList.remove("hide");
        showAlertDialog("登入成功");
      }
    });
});

function hideMsg() {
  signupMsg.style.display = "none";
  signinMsg.style.display = "none";
}

function getUser() {
  fetch(`${location.href}api/user/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        reservationText.classList.remove("hide");
        signinText.classList.remove("hide");
      } else if (data.data) {
        reservationText.classList.remove("hide");
        signinText.classList.add("hide");
        userIcon.classList.remove("hide");
      }
    });
}

function backHomePage() {
  window.location = "/";
}

function booking() {
  fetch(`${location.href}api/user/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        showSigninDialog();
      } else {
        window.location.href = `${location.origin}/booking`;
      }
    });
}

function showSigninDialog() {
  signupPlace.style.display = "none";
  signinPlace.style.display = "block";

  lay.classList.remove("hide");
}

function showSignupDialog() {
  signinPlace.style.display = "none";
  signupPlace.style.display = "block";
}

function closeSignDialog() {
  signinPlace.style.display = "none";
  signupPlace.style.display = "none";
  alertPlace.style.display = "none";
  lay.classList.add("hide");
  location.reload;
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

function showAlertDialog(text) {
  alertPlace.style.display = "block";
  alertText.textContent = text;
  lay.classList.remove("hide");
}

userIcon.addEventListener("click", () => {
  fetch(`api/user/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        showSigninDialog();
      } else {
        window.location.href = `${location.origin}/account`;
      }
    });
});

async function getData() {
  try {
    isLoad = true;
    const url = keyword
      ? `${location.href}api/attractions?page=${page}&keyword=${keyword}`
      : `${location.href}api/attractions?page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.data === null) {
      noItem.replaceChildren();
      noItem.classList.add("noItem");
      noItem.src = "image/Error404-3-01.jpg";
      main.appendChild(noItem);
    } else {
      noItem.replaceChildren();
      let result = data.data;
      lens = result.length;

      const fragment = document.createDocumentFragment();
      result.forEach((item) => {
        const preloadLink = document.createElement("link");
        preloadLink.href = item.image[0];
        preloadLink.rel = "preload";
        preloadLink.as = "image";
        fragment.appendChild(preloadLink);

        const aItem = document.createElement("a");
        aItem.href = `/attraction/${item.id}`;

        const liItem = document.createElement("div");
        liItem.classList.add("spot");

        const imgItem = document.createElement("img");
        imgItem.src = item.image[0];
        imgItem.classList.add("imgItem");
        aItem.appendChild(imgItem);

        const nameItem = document.createElement("a");
        nameItem.href = `/attraction/${item.id}`;
        nameItem.classList.add("nameItem");
        nameItem.id = item.id;
        nameItem.textContent = item.name;

        const mrtCat = document.createElement("div");
        mrtCat.classList.add("mrtItem");

        const mrt = document.createElement("span");
        mrt.textContent = item.mrt;
        mrt.classList.add("mrt");
        mrtCat.append(mrt);

        const cat = document.createElement("span");
        cat.textContent = item.cat;
        cat.classList.add("cat");
        mrtCat.append(cat);

        const box = document.createElement("div");
        box.classList.add("box");
        box.appendChild(aItem);
        box.appendChild(nameItem);
        box.appendChild(mrtCat);
        liItem.appendChild(box);
        fragment.appendChild(liItem);
      });

      spotList.appendChild(fragment);
      page = data.nextPage;
      isLoad = false;
    }
  } catch (error) {
    console.log(
      "There has been a problem with your fetch operation: ",
      error.message
    );
  }
}

function search() {
  page = 0;
  keyword = spotInput.value;
  let spotList = document.querySelector(".list");
  spotList.replaceChildren();
  noItem.textContent = "";
  getData();
}

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};
let observer = new IntersectionObserver(callback, options);
observer.observe(footer);
function callback(entires) {
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

for (let eye of fas) {
  eye.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-eye-slash")) {
      e.target.classList.remove("fa-eye-slash");
      e.target.classList.add("fa-eye");
      signinPassword.setAttribute("type", "text");
      signupPassword.setAttribute("type", "text");
    } else {
      signinPassword.setAttribute("type", "password");
      signupPassword.setAttribute("type", "password");
      e.target.classList.remove("fa-eye");
      e.target.classList.add("fa-eye-slash");
    }
  });
}
