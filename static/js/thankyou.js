"use strict";

const lay = document.querySelector(".lay");
const signinPlace = document.querySelector("#signinPlace");
const signupPlace = document.querySelector("#signupPlace");
const signinBtn = document.querySelector("#signinBtn");
const signupBtn = document.querySelector("#signupBtn");
const signinText = document.querySelector(".signinText");
const signinMsg = document.querySelector(".signinMsg");
const signupMsg = document.querySelector(".signupMsg");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const fas = document.querySelectorAll(".fas");
const reservationText = document.querySelector(".reservationText");
const thankMessage = document.querySelector(".thank-message");
const currentUrl = new URL(window.location.href);
const orderNumber = currentUrl.searchParams.get("number");
const copyableText = document.querySelector(".number");
const copyButton = document.querySelector(".copy-button");
const userIcon = document.querySelector(".usericon");
thankMessage.insertAdjacentHTML(
  "beforeEnd",
  `<span>您的訂單編號是</span> <span class="number">${orderNumber}</span>
    <p>請前往會員中心查看訂單！</p>`
);

window.addEventListener("load", () => {
  getUser();
});
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

function getUser() {
  fetch(`${location.origin}/api/user/auth`, {
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

        location.reload();
      }
    });
});

function hideMsg() {
  signupMsg.style.display = "none";
  signinMsg.style.display = "none";
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
}

function showAlertDialog(text) {
  alertPlace.style.display = "block";
  alertText.textContent = text;
  lay.classList.remove("hide");
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
