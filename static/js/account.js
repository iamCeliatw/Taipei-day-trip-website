"use strict";
const main = document.querySelector(".main");
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
const updateButton = document.querySelector(".update-button");
const reservationText = document.querySelector(".reservationText");
const thankMessage = document.querySelector(".thank-message");
const currentUrl = new URL(window.location.href);
const orderNumber = currentUrl.searchParams.get("number");
const selfImage = document.querySelector(".self-image");
const fileInput = document.querySelector(".file");
const imageContainer = document.querySelector(".self-image-container");
const orderHistory = document.querySelector(".order-history");
const logoutButton = document.querySelector(".logout-button");
const updateName = document.querySelector("#name");
const fileUploader = document.querySelector("#file-uploader");

fileUploader.addEventListener("change", (e) => {
  const file = e.target.files[0];
  console.log(file); // get file object
  let data = new FormData();
  data.append("files", file);
  console.log(data);
  fetch(`/api/user/image`, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      const imageUrl = URL.createObjectURL(file);
      selfImage.src = imageUrl;
      showAlertDialog("更新成功！");
    })
    .catch((error) => {
      console.log(error);
    });
});

window.addEventListener("load", () => {
  getUser();
  getHistory();
  getImg();
});

function getImg() {
  fetch(`/api/user/image`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        showAlertDialog(data.message);
        selfImage.classList.remove("hide");
      } else {
        const imageURL = data.data;
        selfImage.src = imageURL;
        selfImage.classList.remove("hide");
        imageContainer.style.border = "0px";
      }
    })
    .catch((error) => {
      console.log(error);
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
        signinText.classList.remove("hide");
      } else if (data.data) {
        reservationText.classList.remove("hide");
        signinText.classList.add("hide");
      }
    });
}

function getHistory() {
  fetch(`api/orders`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].grouping.length > 1) {
        }
        orderHistory.insertAdjacentHTML(
          "beforeend",
          `
    <div class="order-place">
        <div class="order-item">
          <button id="accordion-button-1" aria-expanded="false">
            <span class="order-title"
              >${data[i].order_number}</span
            ><span class="icon" aria-hidden="true"></span>
          </button>
          <div class="order-detail"></div>
        </div>
    </div>
        `
        );
      }
      const orderDetail = document.querySelectorAll(".order-detail");

      for (let i = 0; i < orderDetail.length; i++) {
        for (let j = 0; j < data[i].grouping.length; j++) {
          orderDetail[i].insertAdjacentHTML(
            "beforeend",
            `
                <div class="order-img">
                <img src=https:${data[i].grouping[j]["image:https"]} alt="" />
                  </div>
                <div class="order-text">
                  <div>
                    <span class="text-question">景點名稱：</span>
                    ${data[i].grouping[j].attraction_name}
                  </div>
                  <div>
                    <span class="text-question">日期：</span>
                    ${data[i].grouping[j].date}
                  </div>
                  <div>
                    <span class="text-question">時間：</span>
                    ${data[i].grouping[j].time}
                  </div>
                  <div>
                    <span class="text-question">費用：</span>
                     ${data[i].grouping[j].price} 元
                    
                  </div>
                  <div>
                    <span class="text-question">地點：</span>
                    ${data[i].grouping[j].address}
                  </div>
                  <div>
                    <span class="text-question">訂單編號：</span>
                    ${data[i].order_number}
                  </div>
                  <div>
                    <span class="text-question">預定聯絡人：</span>
                    ${data[i].name}
                  </div>
                  <div>
                    <span class="text-question">預定信箱：</span>
                    ${data[i].email}
                  </div>
                  <div>
                    <span class="text-question">預定電話：</span>
                    ${data[i].phone}
                  </div>
                  <div>
                </div>
          `
          );
        }
        orderDetail[i].insertAdjacentHTML(
          "beforeEnd",
          `   <div class="totalprice">
                  <span class="totalprice-question">總金額：</span>
                   ${data[i].price} 元
              </div>`
        );
      }
      // FAQ欄位
      const items = document.querySelectorAll(".order-place button");
      function toggleAccordion() {
        const itemToggle = this.getAttribute("aria-expanded");
        for (let i = 0; i < items.length; i++) {
          items[i].setAttribute("aria-expanded", "false");
        }
        if (itemToggle == "false") {
          this.setAttribute("aria-expanded", "true");
        }
      }

      items.forEach((item) => item.addEventListener("click", toggleAccordion));
    });
}

//點擊預定行程跳轉
function booking() {
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
        window.location.href = `${location.origin}/booking`;
      }
    });
}

//更改按鍵
updateButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  let updateNameValue = updateName.value;
  fetch(`${location.origin}/api/user/auth`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: updateNameValue }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        console.log(data);
        showAlertDialog(data.message);
      }
      showAlertDialog("更新成功！");
    });
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
        // logoutText.classList.remove("hide");
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
  lay.classList.add("hide");
}
//顯示提示框框
function showAlertDialog(text) {
  alertPlace.style.display = "block";
  alertText.textContent = text;
  lay.classList.remove("hide");
}

// 點擊登出系統;
logoutButton.addEventListener("click", (e) => {
  fetch(`${location.origin}/api/user/auth`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        main.innerHTML = "";
        showAlertDialog(`尚未登入，請登入以瀏覽頁面，
        將在3秒後回到首頁`);
        countDown();
      }
    });
});

//跳登入顯示框顯示三秒跳轉首頁
let countdownDuration = 3;
function countDown() {
  let countdownTimer = setInterval(function () {
    countdownDuration--;
    if (countdownDuration === 0) {
      clearInterval(countdownTimer);
      window.location.href = "/";
    }
    showAlertDialog(
      `尚未登入，請登入以瀏覽頁面，
    將在${countdownDuration}秒後回到首頁`
    );
  }, 1000);
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
