window.addEventListener('DOMContentLoaded', function () {

    let sliderClickTimeout;
    let isPaused = false;
    let slideIndex = 1;
    let offset = 0;
    const slides = document.querySelectorAll('.slide'),
        slidesWrapper = document.querySelector('.slider__wrapper'),
        sliderCarousel = document.querySelector('.slider_carousel');
    prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        sliderIndicatorsSection = document.querySelector('.slider-indicator__wrapper'),
        width = getComputedStyle(slidesWrapper).width;

    if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
        total.textContent = `0${slides.length}`;
    } else {
        current.textContent = slideIndex;
        total.textContent = slides.length;
    }

    function digFromStr(str) {
        return +str.replace(/\D/g, "");
    }


    function checkShadow() {
        if (slidesWrapper.classList.contains('shadow_active')) {
            slidesWrapper.classList.remove('shadow_active');
        }
    }
    function checkSlidesLength() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    slidesWrapper.style.overflow = 'hidden';
    sliderCarousel.style.width = 100 * slides.length + '%';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    // 
    indicators.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        list-style: none;
    `;

    sliderIndicatorsSection.append(indicators);

    slides.forEach(item => {
        item.addEventListener('click', () => {
            if (!isPaused) {
                isPaused = true;
            } else {
                isPaused = false;
            }
            slidesWrapper.classList.toggle("shadow_active");
        });
    });


    for (let i = 0; i < slides.length; i++) {
        const indicatorImg = document.createElement('img');
        indicatorImg.style.cssText = `
            height: 100%;
            width: 100%;
            object-fit: cover;
            opacity: .65;
    `;

        indicatorImg.src = `img/slider/${i + 1}.jpg`;
        indicatorImg.setAttribute('data-slide-to', i + 1);
        const dot = document.createElement('li');
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 60px;
            height: 50px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            indicatorImg.style.opacity = '1';
        }
        dot.append(indicatorImg);
        indicators.append(dot);
        dots.push(indicatorImg);
    }

    function sliderNext() {

        if (offset == digFromStr(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += digFromStr(width);
        }
        sliderCarousel.style.transition = '0.5s all';
        sliderCarousel.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        checkSlidesLength();

        dots.forEach(item => {
            item.style.opacity = '0.65';
        });
        dots[slideIndex - 1].style.opacity = '1';
    }

    next.addEventListener('click', () => {
        clearInterval(sliderClickTimeout);
        isPaused = true;
        checkShadow();
        sliderNext();

        sliderClickTimeout = setTimeout(function () {
            isPaused = false;
        }, 3500);
    });


    prev.addEventListener('click', () => {
        clearInterval(sliderClickTimeout);
        isPaused = true;
        checkShadow();
        if (offset == 0) {
            offset = digFromStr(width) * (slides.length - 1);
        } else {
            offset -= digFromStr(width);
        }
        sliderCarousel.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        checkSlidesLength();

        sliderClickTimeout = setTimeout(function () {
            isPaused = false;
        }, 3500);

        dots.forEach(item => {
            item.style.opacity = '0.65';
        });
        dots[slideIndex - 1].style.opacity = '1';
    });

    dots.forEach(item => {
        item.addEventListener('click', (e) => {
            clearInterval(sliderClickTimeout);
            isPaused = true;
            checkShadow();
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = digFromStr(width) * (slideTo - 1);
            sliderCarousel.style.transform = `translateX(-${offset}px)`;

            checkSlidesLength();

            dots.forEach(item => {
                item.style.opacity = '0.65';
            });
            sliderClickTimeout = setTimeout(function () {
                isPaused = false;
            }, 3500);

            dots[slideIndex - 1].style.opacity = '1';
        });
    });

    setInterval(function () {
        if (!isPaused) {
            sliderNext();
        }
    }, 3500);

    // ==========================================================================
    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        sex = localStorage.setItem('sex', 'female');
    }
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        ratio = localStorage.setItem('ratio', 1.375);
    }


    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
        });
        elements.forEach(item => {
         if (item.getAttribute('data-ratio') === localStorage.getItem('ratio') ||
             item.getAttribute('id') === localStorage.getItem('sex')) {
            item.classList.add(activeClass);
         }
        });

    }

    initLocalSettings('#gender div', "calculating__choose-item_active");
    initLocalSettings('.calculating__choose_big div', "calculating__choose-item_active");


function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
        result.textContent = '_____';
        return;
    }

    if (sex === 'female') {
        result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else {
        result.textContent = Math.round(88.36 + ((13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }
}
calcTotal();

function getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
        elem.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-ratio')) {
                ratio = e.target.getAttribute('data-ratio');
                localStorage.setItem("ratio", e.target.getAttribute('data-ratio'));
            } else {
                sex = e.target.getAttribute('id');
                localStorage.setItem("sex", e.target.getAttribute('id'));
            }
            elements.forEach(item => {
                item.classList.remove(activeClass);
            });

            e.target.classList.add(activeClass);
            calcTotal();
        });
    });
}

function getDynamicInformation(selector) {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {

        if (input.value.match(/\D/m)) {
            input.style.border = '1px solid red';
        } else {
            input.style.border = 'none';
        }

        switch (input.getAttribute('id')) {
            case 'height': height = +input.value;
                break;
            case 'weight': weight = +input.value;
                break;
            case 'age': age = +input.value;
                break;
        }

        calcTotal();
    });
}

getStaticInformation('#gender div', "calculating__choose-item_active");
getStaticInformation('.calculating__choose_big div', "calculating__choose-item_active");
getDynamicInformation('#height');
getDynamicInformation('#weight');
getDynamicInformation('#age');
});


