"use strict";

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
const signinMsg = document.querySelector(".signinMsg");
const signupMsg = document.querySelector(".signupMsg");
const reservationText = document.querySelector(".reservationText");
const reservation = document.querySelector(".reservation");
const alertPlace = document.querySelector("#alertPlace");
const alertText = document.querySelector(".alertText");
const fas = document.querySelectorAll(".fas");
const updateText = document.querySelector(".updateText");
const updatePlace = document.querySelector("#updatePlace");
const userIcon = document.querySelector(".usericon");

let eachPrice;
let timeValue;
let spotName;
let spotAddress;
let bookImg;
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const signupEmail = document.querySelector("#signupEmail").value;
  const signupName = document.querySelector("#signupName").value;
  const signupPassword = document.querySelector("#signupPassword").value;
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
        signupMsg.style.color = "red";
        signupMsg.textContent = data.message;
        window.setTimeout(hideMsg, 2000);
      } else {
        signupMsg.style.display = "block";
        signupMsg.textContent = data.message;
        signupMsg.style.color = "green";
      }
    });
});

function backHomePage() {
  window.location = "/";
}

userIcon.addEventListener("click", () => {
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
        window.location.href = `${location.origin}/account`;
      }
    });
});

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
        signinText.classList.add("hide");
        userIcon.classList.remove("hide");
        location.reload();
      }
    });
});

function hideMsg() {
  signupMsg.style.display = "none";
  signinMsg.style.display = "none";
}

window.addEventListener("load", () => {
  getUser();
  getData();
});

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
  lay.classList.add("hide");
  signinPlace.style.display = "none";
  signupPlace.style.display = "none";
  alertPlace.style.display = "none";
}

function showAlertDialog(text) {
  alertPlace.style.display = "block";
  alertText.textContent = text;
  lay.classList.remove("hide");
}

function getData() {
  fetch(url + id)
    .then((response) => response.json())
    .then((data) => {
      document.title = `Taipei day trip - ${data.data.name}`;
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
      let firstSlide = document.getElementsByClassName("carousel__slide")[0];
      let carousel__indicator = document.getElementsByClassName(
        "carousel__indicator"
      )[0];
      firstSlide.classList.add("current-slide");
      carousel__indicator.classList.add("current-slide");
      bookImg = document.getElementsByClassName("carousel__image")[1].src;

      attractionMessage.insertAdjacentHTML(
        "afterBegin",
        ` <div class="attraction-data">
            <h3 class="name">${data.data.name}</h3>
            <p>${data.data.cat} at ${data.data.mrt}</p>
        </div>`
      );
      description.insertAdjacentHTML(
        "afterBegin",
        ` <p>
        ${data.data.description}
        </p>
        <h3>景點地址：</h3>
        <p  class="address">${data.data.address}</p>
        <h3>交通方式：</h3>
        <p>
        ${data.data.direction}
        </p>
        <iframe width="900" height="600" frameborder="0" scrolling="no" marginheight="20px" marginwidth="10"
        src=https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${data.data.latitude},${data.data.longitude}(${data.data.name})&z=16&output=embed&t=></iframe>
        
        `
      );
      spotName = document.querySelector(".name").textContent;
      spotAddress = document.querySelector(".address").textContent;

      let slides = Array.prototype.slice.call(track.children);

      const nextButton = document.querySelector(".carousel__button--right");
      const prevButton = document.querySelector(".carousel__button--left");
      const dotsNav = document.querySelector(".carousel__nav");
      const dots = Array.from(dotsNav.children);

      const slideWidth = slides[0].getBoundingClientRect().width;

      slides.forEach(function (slide, index) {
        slide.style.left = slideWidth * index + "px";
      });

      prevButton.addEventListener("click", (e) => {
        let currentSlide = track.querySelector(".current-slide");
        let prevSlide = currentSlide.previousElementSibling;

        let currentDot = dotsNav.querySelector(".current-slide");
        let prevDot = currentDot.previousElementSibling;

        let prevIndex = slides.findIndex((slide) => slide === prevSlide);
        moveToslide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
      });

      nextButton.addEventListener("click", () => {
        let currentSlide = track.querySelector(".current-slide");
        let nextSlide = currentSlide.nextElementSibling;
        let currentDot = dotsNav.querySelector(".current-slide");

        let nextDot = currentDot.nextElementSibling;
        let nextIndex = slides.findIndex((slide) => slide === nextSlide);
        moveToslide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
      });

      dotsNav.addEventListener("click", (e) => {
        let targetDot = e.target.closest("button");

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
        if (!targetIndex) {
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

oneHalfDay.addEventListener("click", (e) => {
  eachPrice = 2000;
  totalPrice.textContent = `新台幣${eachPrice}元`;
});

nextHalfDay.addEventListener("click", (e) => {
  eachPrice = 2500;
  totalPrice.textContent = `新台幣${eachPrice}元`;
});

const currentDate = new Date();

document.getElementById("myDateInput").min = currentDate
  .toISOString()
  .split("T")[0];

function postBookData() {
  let oneDayRadio = document.querySelector("#day1");
  let dateValue = document.querySelector(".date").value;
  let priceValue = document.querySelector(".totalPrice").textContent;

  eachPrice = priceValue.replace(/[^\d]/g, " ");
  if (oneDayRadio.checked) {
    timeValue = oneHalfDay.textContent;
  } else {
    timeValue = nextHalfDay.textContent;
  }
  fetch(`${location.origin}/api/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attractionId: id,
      name: spotName,
      address: spotAddress,
      image: bookImg,
      date: dateValue,
      time: timeValue,
      price: eachPrice,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        window.location.href = `${location.origin}/booking`;
      } else {
        showAlertDialog(data.message);
      }
    });
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

reservation.addEventListener("click", () => {
  postBookData();
});

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

function moveToslide(track, currentSlide, targetSlide) {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";
  currentSlide.classList.remove("current-slide");
  targetSlide.classList.add("current-slide");
}

function updateDots(currentDot, targetDot) {
  currentDot.classList.remove("current-slide");
  targetDot.classList.add("current-slide");
}
