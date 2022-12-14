"use strict";

const reservationText = document.querySelector(".reservationText");
const signinPlace = document.querySelector("#signinPlace");
const signupPlace = document.querySelector("#signupPlace");
const lay = document.querySelector(".lay");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const signinText = document.querySelector(".signinText");
const logoutText = document.querySelector(".logoutText");
const main = document.querySelector(".main");
const totalPriceValue = document.querySelector(".totalPrice");
let deleteButtons;
let deleteId;
let totalPrice = 0;
window.addEventListener("load", () => {
  getUser();
  getBookData();
});

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
        // location.reload();
        getUser();
      }
    });
});
//載入頁面取得訂單資訊
function getBookData() {
  fetch(`${location.origin}/api/booking`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.multiple_date) {
        showAlertDialog(
          `您目前有重複預定日期為：${data.multiple_date}，請留意訂單資訊是否正確`
        );
      }
      if (!data.data) {
        const noReservation = document.createElement("div");
        const noReserText = document.createElement("h4");
        noReservation.classList.add("booking-top");
        main.replaceChildren(noReservation);
        noReservation.append(noReserText);
        noReserText.textContent = "暫無預定行程喔！";
      } else {
        for (let i = 0; i < data.data.length; i++) {
          console.log(data.data[i].time);

          totalPrice = totalPrice + data.data[i].price;
          main.insertAdjacentHTML(
            "beforeBegin",
            `<div class="booking-top">
            <div class="booking-content">
                <div class="booking-img">
                <img src=${data.data[i].image} alt="" />
            </div>

          <div class="booking-text">
            <h4>台北一日遊：${data.data[i].attraction_name}</h4>
            <span class="form-question">日期：</span>
            <span>${data.data[i].date}</span>
            <br />
            <span class="form-question">時間：</span>
            <span class="time">${data.data[i].time}</span>
            <br />
            <span class="form-question">費用：</span>
            <span>新台幣${data.data[i].price}元</span>
            <br />
            <span class="form-question">地點：</span>
            <span>${data.data[i].address}</span>
          </div>
          </div>
          <button class="delete-img" id="${data.data[i].id}">
            <img src="image/icon_delete.png" alt="" />
          </button>
        
        </div>
        <hr class="middle-hr" />
      `
          );
        }
        totalPriceValue.textContent = `總價：${totalPrice}元`;
        const time = document.querySelectorAll(".time");
        const timeArray = Array.from(time);
        timeArray.forEach(function (time) {
          if (time.textContent === "上半天") {
            time.textContent = "☀️ 8:00 ~ 16:00 ";
          } else time.textContent = "🌙 16:00 ~ 22:00";
        });
        const bookingTop = document.querySelector(".booking-top");
        bookingTop.insertAdjacentHTML(
          "afterBegin",
          `<h4>您好，${data.data[0].name}，您的待預定行程如下：</h4>`
        );
        deleteBooking();
      }
    });
}

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
//取得用戶 未登入跳轉
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
        main.innerHTML = "";
        showAlertDialog(`尚未登入，請登入以瀏覽頁面，
        將在3秒後回到首頁`);
        countDown();
      } else {
        reservationText.classList.remove("hide");
        signinText.classList.add("hide");
        logoutText.classList.remove("hide");
      }
    });
}

//回首頁
function backHomePage() {
  window.location = "/";
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

//刪除景點
function deleteBooking() {
  deleteButtons = document.querySelectorAll(".delete-img");
  for (let button of deleteButtons) {
    button.addEventListener("click", function () {
      deleteId = this.id;
      fetch(`${location.origin}/api/booking`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            location.reload();
          }
        });
    });
  }
}
