"use strict";

//取網址最後一個字當作id值
let id = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
let carousel__nav = document.querySelector(".carousel__nav");

let url = `/api/attraction/`;

let attractionMessage = document.querySelector(".attraction-message");
let description = document.querySelector(".description");
let track = document.querySelector(".carousel__track");
let oneHalfDay = document.querySelector(".oneHalfDay");
let nextHalfDay = document.querySelector(".nextHalfDay");
let totalPrice = document.querySelector(".totalPrice");

fetch(url + id)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.data.image.length; i++) {
      track.insertAdjacentHTML(
        "afterBegin",
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
        </p>`
    );

    let slides = Array.from(track.children);
    // console.log(track);
    let nextButton = document.querySelector(".carousel__button--right");
    let prevButton = document.querySelector(".carousel__button--left");
    let dotsNav = document.querySelector(".carousel__nav");
    let dots = Array.from(dotsNav.children);
    //取得圖片大小
    let slideWidth = slides[0].getBoundingClientRect().width;
    console.log(slideWidth);

    let setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + "px";
    };
    slides.forEach(setSlidePosition);

    let moveToslide = (track, currentSlide, targetSlide) => {
      track.style.transform = "translateX(-" + targetSlide.style.left + ")";
      currentSlide.classList.remove("current-slide");
      targetSlide.classList.add("current-slide");
    };

    let updateDots = (currentDot, targetDot) => {
      currentDot.classList.remove("current-slide");
      targetDot.classList.add("current-slide");
    };

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
    // when i click the nav indicators ,move to the slide
    dotsNav.addEventListener("click", (e) => {
      //what indicator was click on?
      let targetDot = e.target.closest("button");
      //   console.log("test1");
      //stop the function
      if (!targetDot) return;
      let currentSlide = track.querySelector(".current-slide");
      let currentDot = dotsNav.querySelector(".current-slide");
      let targetIndex = dots.findIndex((dot) => dot === targetDot);
      let targetSlide = slides[targetIndex];

      //   console.log(targetIndex);
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

oneHalfDay.addEventListener("click", (e) => {
  totalPrice.textContent = "新台幣2000元";
});

nextHalfDay.addEventListener("click", (e) => {
  totalPrice.textContent = "新台幣2500元";
});
