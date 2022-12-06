"use strict";

//取網址最後一個字當作id值
const id = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
const carousel__nav = document.querySelector(".carousel__nav");

const url = `/api/attraction/`;

const attractionMessage = document.querySelector(".attraction-message");
const description = document.querySelector(".description");
const track = document.querySelector(".carousel__track");
const oneHalfDay = document.querySelector(".oneHalfDay");
const nextHalfDay = document.querySelector(".nextHalfDay");
const totalPrice = document.querySelector(".totalPrice");

const lay = document.querySelector(".lay");
const signinPlace = document.querySelector("#signinPlace");
const signupPlace = document.querySelector("#signupPlace");
const signinBtn = document.querySelector("#signinBtn");
const signupBtn = document.querySelector("#signupBtn");
const signinText = document.querySelector(".signinText");
const logoutText = document.querySelector(".logoutText");
const signinMsg = document.querySelector(".signinMsg");
const signupMsg = document.querySelector(".signupMsg");
const reservationText = document.querySelector(".reservationText");

// 註冊按鈕
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let signupName = document.querySelector("#signupName").value;
  let signupEmail = document.querySelector("#signupEmail").value;
  let signupPassword = document.querySelector("#signupPassword").value;
  fetch(`${location.origin}/api/user`, {
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

//點台北一日遊 回到首頁
function backHomePage() {
  window.location = "/";
}

// 登入按鈕
signinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let signinEmail = document.querySelector("#signinEmail").value;
  let signinPassword = document.querySelector("#signinPassword").value;
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

window.addEventListener("load", (e) => {
  getUser();
  getData();
});

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
  lay.classList.add("hide");
}
// 取得景點資訊
function getData() {
  fetch(url + id)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.data.image.length; i++) {
        track.insertAdjacentHTML(
          "beforeEnd",
          `<li class="carousel__slide">
            <img class="carousel__image" src=${data.data.image[i]} alt="" />
         </li>
        `
        );
        carousel__nav.insertAdjacentHTML(
          "afterBegin",
          `<button class="carousel__indicator"></button>`
        );
      }
      // 第一個li & button 加上 current-slide
      let firstSlide = document.getElementsByClassName("carousel__slide")[0];
      let carousel__indicator = document.getElementsByClassName(
        "carousel__indicator"
      )[0];
      firstSlide.classList.add("current-slide");
      carousel__indicator.classList.add("current-slide");

      attractionMessage.insertAdjacentHTML(
        "afterBegin",
        ` <div class="attraction-data">
            <h3>${data.data.name}</h3>
            <p>${data.data.cat} at ${data.data.mrt}</p>
        </div>`
      );
      description.insertAdjacentHTML(
        "afterBegin",
        ` <p>
        ${data.data.description}
        </p>
        <h3>景點地址：</h3>
        <p>${data.data.address}</p>
        <h3>交通方式：</h3>
        <p>
        ${data.data.direction}
        </p>
        <iframe width="900" height="600" frameborder="0" scrolling="no" marginheight="20px" marginwidth="10" src=https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${data.data.latitude},${data.data.longitude}(${data.data.name})&z=16&output=embed&t=></iframe>
        
        `
      );

      let slides = Array.prototype.slice.call(track.children);

      let nextButton = document.querySelector(".carousel__button--right");
      let prevButton = document.querySelector(".carousel__button--left");
      let dotsNav = document.querySelector(".carousel__nav");
      let dots = Array.from(dotsNav.children);
      //取得圖片大小
      let slideWidth = slides[0].getBoundingClientRect().width;

      //給定每個slide left
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.left = slideWidth * i + "px";
      }

      function moveToslide(track, currentSlide, targetSlide) {
        track.style.transform = "translateX(-" + targetSlide.style.left + ")";
        currentSlide.classList.remove("current-slide");
        targetSlide.classList.add("current-slide");
      }

      function updateDots(currentDot, targetDot) {
        currentDot.classList.remove("current-slide");
        targetDot.classList.add("current-slide");
      }

      // 點擊左邊的按鈕往左滑
      prevButton.addEventListener("click", (e) => {
        //當前照片
        let currentSlide = track.querySelector(".current-slide");
        let prevSlide = currentSlide.previousElementSibling;
        //當前小點點
        let currentDot = dotsNav.querySelector(".current-slide");
        let prevDot = currentDot.previousElementSibling;

        let prevIndex = slides.findIndex((slide) => slide === prevSlide);
        moveToslide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
      });

      // 點擊右邊按鈕往右滑
      nextButton.addEventListener("click", (e) => {
        let currentSlide = track.querySelector(".current-slide");
        let nextSlide = currentSlide.nextElementSibling;
        let currentDot = dotsNav.querySelector(".current-slide");
        //下一個元素
        let nextDot = currentDot.nextElementSibling;
        let nextIndex = slides.findIndex((slide) => slide === nextSlide);
        moveToslide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
      });
      // 點擊移動點點
      dotsNav.addEventListener("click", (e) => {
        //what indicator was click on?
        let targetDot = e.target.closest("button");
        //stop the function
        if (!targetDot) return;
        let currentSlide = track.querySelector(".current-slide");
        let currentDot = dotsNav.querySelector(".current-slide");
        let targetIndex = dots.findIndex((dot) => dot === targetDot);
        let targetSlide = slides[targetIndex];

        moveToslide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
      });
      let hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
          prevButton.classList.add("is-hidden");
          nextButton.classList.remove("is-hidden");
        } else if (targetIndex === slides.length - 1) {
          prevButton.classList.remove("is-hidden");
          nextButton.classList.add("is-hidden");
        } else {
          prevButton.classList.remove("is-hidden");
          nextButton.classList.remove("is-hidden");
        }
      };
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
        console.log(data);
        reservationText.classList.remove("hide");
        signinText.classList.add("hide");
        logoutText.classList.remove("hide");
      }
    });
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
        location.reload();
      }
    });
});

//上半天顯示價錢
oneHalfDay.addEventListener("click", (e) => {
  totalPrice.textContent = "新台幣2000元";
});
// 下半天顯示價錢
nextHalfDay.addEventListener("click", (e) => {
  totalPrice.textContent = "新台幣2500元";
});
