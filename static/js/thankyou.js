"use strict";

const lay = document.querySelector(".lay");
const signinPlace = document.querySelector("#signinPlace");
const signupPlace = document.querySelector("#signupPlace");
const signinBtn = document.querySelector("#signinBtn");
const signupBtn = document.querySelector("#signupBtn");
const signinText = document.querySelector(".signinText");
const logoutText = document.querySelector(".logoutText");
const signinMsg = document.querySelector(".signinMsg");
const signupMsg = document.querySelector(".signupMsg");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const fas = document.querySelectorAll(".fas");
const changeNameText = document.querySelector(".changeNameText");
const changeNameBtn = document.querySelector("#changeNameBtn");
const updateText = document.querySelector(".updateText");
const updatePlace = document.querySelector("#updatePlace");
const reservationText = document.querySelector(".reservationText");
const thankMessage = document.querySelector(".thank-message");
const currentUrl = new URL(window.location.href);
const orderNumber = currentUrl.searchParams.get("number");
const copyableText = document.querySelector(".number");
const copyButton = document.querySelector(".copy-button");
thankMessage.insertAdjacentHTML(
  "beforeEnd",
  `<span>您的訂單編號是</span> <span class="number">${orderNumber}</span>
    <p>請記下此訂單編號，以利追蹤查詢</p>`
);

window.addEventListener("load", () => {
  getUser();
});

//navigator.clipboard.writeText(copyableText.textContent) ubuntu不支援
const select = (DOM) => document.querySelector(DOM);
const range = document.createRange();
const texts = select(".number");
const selection = window.getSelection();
select(".copy-button").addEventListener("click", () => {
  range.selectNode(texts);
  selection.addRange(range);
  document.execCommand("copy");
  copyButton.textContent = "✔️已複製";
  copyButton.classList.add("copied-button");
  window.setTimeout(() => {
    copyButton.textContent = "點此複製編號";
    copyButton.classList.remove("copied-button");
  }, 2000);
});

function remindMsg() {
  copyButton.textContent = "點此複製編號";
  copyButton.style.border = "";
  copyButton.style.backgroundColor = "";
  copyButton.style.color = "";
}

function booking() {
  fetch(`${location.origin}/api/user/auth`, {
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

// 載入頁面取得登入資訊
function getUser() {
  fetch(`${location.origin}/api/user/auth`, {
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
//更改按鍵
changeNameBtn.addEventListener("click", (e) => {
  //   e.preventDefault();
  let updateNameValue = document.getElementById("updateNameValue").value;
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

//點台北一日遊 回到首頁
function backHomePage() {
  window.location = "/";
}

// 登入按鈕
signinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const signinEmail = document.querySelector("#signinEmail").value;
  const signinPassword = document.querySelector("#signinPassword").value;
  fetch(`${location.origin}/api/user/auth`, {
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
        console.log(data);
        signinText.classList.add("hide");
        logoutText.classList.remove("hide");
        location.reload();
      }
    });
});

function hideMsg() {
  signupMsg.style.display = "none";
  signinMsg.style.display = "none";
}

// 點擊登入 跳出視窗
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
// 關閉註冊登入
function closeSignDialog() {
  signinPlace.style.display = "none";
  signupPlace.style.display = "none";
  alertPlace.style.display = "none";
  updatePlace.style.display = "none";
  lay.classList.add("hide");
}
//顯示提示框框
function showAlertDialog(text) {
  alertPlace.style.display = "block";
  alertText.textContent = text;
  lay.classList.remove("hide");
}

//點擊登出系統
logoutText.addEventListener("click", (e) => {
  fetch(`${location.origin}/api/user/auth`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        logoutText.classList.add("hide");
        signinText.classList.remove("hide");
        changeNameText.classList.add("hide");
        location.reload();
      }
    });
});
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
