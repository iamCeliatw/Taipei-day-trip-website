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
const changeNameText = document.querySelector(".changeNameText");

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
const logoutText = document.querySelector(".logoutText");
const msg = document.querySelector(".msg");
const signinMsg = document.querySelector(".signinMsg");
const signupMsg = document.querySelector(".signupMsg");
const reservationText = document.querySelector(".reservationText");
const noItem = document.createElement("img");
const fas = document.querySelectorAll(".fas");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const updateText = document.querySelector(".updateText");
const updatePlace = document.querySelector("#updatePlace");
const changeNameBtn = document.querySelector("#changeNameBtn");
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

// sign up
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

// signin
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
        logoutText.classList.remove("hide");
        changeNameText.classList.remove("hide");
        showAlertDialog("登入成功");
      }
    });
});
//更改按鍵
changeNameBtn.addEventListener("click", (e) => {
  //   e.preventDefault();
  let updateNameValue = document.querySelector("#updateNameValue").value;
  fetch(`${location.origin}/api/user/auth`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: updateNameValue }),
  })
    .then((res) => res.json())
    .then((data) => {
      updatePlace.style.display = "block";
      if (!data.data) {
        updateText.textContent = "更新失敗，請重試一次";
        updateText.style.color = "red";
        window.setTimeout(hideMsg, 2000);
      }
      updateText.textContent = "更新成功";
      updateText.style.color = "green";
      window.setTimeout(hideMsg, 2000);
    });
});

//按下更改
changeNameText.addEventListener("click", (e) => {
  e.preventDefault();
  updatePlace.style.display = "block";
});

function hideMsg() {
  signupMsg.style.display = "none";
  signinMsg.style.display = "none";
  updateText.style.display = "none";
}

// get user
function getUser() {
  fetch(`${location.href}api/user/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //未登入
      if (!data.data) {
        reservationText.classList.remove("hide");
        logoutText.classList.add("hide");
        signinText.classList.remove("hide");
      } else if (data.data) {
        reservationText.classList.remove("hide");
        signinText.classList.add("hide");
        logoutText.classList.remove("hide");
        changeNameText.classList.remove("hide");
      }
    });
}

//點台北一日遊 回到首頁
function backHomePage() {
  window.location = "/";
}
//點擊預定行程跳轉
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

//點擊登入 跳出視窗
function showSigninDialog() {
  signupPlace.style.display = "none";
  signinPlace.style.display = "block";

  lay.classList.remove("hide");
}
// 點擊 點此註冊 隱藏登入框 顯示註冊框
function showSignupDialog() {
  signinPlace.style.display = "none";
  signupPlace.style.display = "block";
}
//關閉註冊登入
function closeSignDialog() {
  signinPlace.style.display = "none";
  signupPlace.style.display = "none";
  alertPlace.style.display = "none";
  updatePlace.style.display = "none";
  lay.classList.add("hide");
  location.reload;
}

//搜尋景點分類框
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

function updateNameDialog() {
  updatePlace.style.display = "block";
  lay.classList.remove("hide");
}

//顯示提示框框
function showAlertDialog(text) {
  alertPlace.style.display = "block";
  alertText.textContent = text;
  lay.classList.remove("hide");
}

//點擊登出系統
logoutText.addEventListener("click", () => {
  fetch(`${location.href}api/user/auth`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.ok) {
        location.reload();
        logoutText.classList.add("hide");
        changeNameText.classList.add("hide");
        signinText.classList.remove("hide");
      }
    });
});

//取得首頁景點資訊
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
      //虛擬對象
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

//點擊搜尋按鈕 觸發search
function search() {
  page = 0;
  keyword = spotInput.value;
  let spotList = document.querySelector(".list");
  spotList.replaceChildren();
  noItem.textContent = "";
  getData();
}

// 偵測滾動 載入更多
let options = {
  root: null, // document viewport
  rootMargin: "0px",
  threshold: 0.3, // 進入畫面的比例
};
let observer = new IntersectionObserver(callback, options);
//觀察footer
observer.observe(footer);
// callback
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

//查看密碼小眼睛
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
