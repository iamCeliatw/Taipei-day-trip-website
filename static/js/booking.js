"use strict";

const reservationText = document.querySelector(".reservationText");
const signinPlace = document.querySelector("#signinPlace");
const signupPlace = document.querySelector("#signupPlace");
const lay = document.querySelector(".lay");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const signinText = document.querySelector(".signinText");

const main = document.querySelector(".main");
const totalPriceValue = document.querySelector(".totalPrice");
const noReservation = document.createElement("div");
const noReserText = document.createElement("h4");
const updateText = document.querySelector(".updateText");
const updatePlace = document.querySelector("#updatePlace");
const bookingButton = document.querySelector(".booking-button");

const contactName = document.querySelector("#contact-name");
const contactMail = document.querySelector("#contact-mail");
const contactPhone = document.querySelector("#contact-phone");
const userIcon = document.querySelector(".usericon");

let deleteButtons;
let deleteId;
let allOrderId;
let totalPrice = 0;
window.addEventListener("load", () => {
  getUser();
  getBookData();
});

function hideMsg() {
  signupMsg.style.display = "none";
  signinMsg.style.display = "none";
  updateText.style.display = "none";
}

function showNoData() {
  noReservation.classList.add("booking-top");
  main.replaceChildren(noReservation);
  noReservation.append(noReserText);
  noReserText.textContent = "暫無預定行程喔！";
}

function getBookData() {
  fetch(`${location.origin}/api/booking`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        showNoData();
      } else {
        allOrderId = data.data.map((element) => element.id);
        if (data.multiple_date.length > 0) {
          showAlertDialog(
            `您目前有重複預定日期為：${data.multiple_date}，請留意訂單資訊是否正確`
          );
        }
        for (let i = 0; i < data.data.length; i++) {
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
          <hr class="middle-hr" />
        </div>
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
        userIcon.classList.remove("hide");
      }
    });
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

function backHomePage() {
  window.location = "/";
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

TPDirect.setupSDK(
  126881,
  "app_bYUbbLGSN9M4WgPtco41lGWlLIhwuZmjCO4ErwnR457fmatY8TX9KQxkANp8",
  "sandbox"
);

var fields = {
  number: {
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    element: "#card-expiration-date",
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "後三碼",
  },
};
TPDirect.card.setup({
  fields: fields,
  styles: {
    input: {
      color: "gray",
    },
    ".valid": {
      color: "green",
    },
    ".invalid": {
      color: "red",
    },
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});

TPDirect.card.onUpdate(function (update) {
  if (update.canGetPrime) {
    bookingButton.removeAttribute("disabled");
  } else {
    bookingButton.setAttribute("disabled", true);
  }
});

function onSubmit(event) {
  event.preventDefault();
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  if (tappayStatus.canGetPrime === false) {
    showAlertDialog("無法處理請求，請再試一次");
    return;
  }
  TPDirect.card.getPrime((result) => {
    console.log("get prime 成功，prime: " + result.card.prime);
    postOrders(result.card.prime);
  });
}

function postOrders(prime) {
  fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: allOrderId,
      price: totalPrice,
      prime: prime,
      name: contactName.value,
      mail: contactMail.value,
      phone: contactPhone.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.data.error) {
        showAlertDialog(data.data.payment.message);
      } else if (data.data.number) {
        bookingButton.setAttribute("disabled", true);
        window.location.href = `/thankyou?number=${data.data.number}`;
      }
    });
}
