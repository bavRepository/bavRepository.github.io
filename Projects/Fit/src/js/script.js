window.addEventListener('DOMContentLoaded', function () {
    //Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = "2023-06-22";

    function getTimeRemaining(endtime) {
        const totalTime = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(totalTime / (1000 * 60 * 60 * 24)),
            hours = Math.floor((totalTime / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((totalTime / (1000 * 60)) % 60),
            seconds = Math.floor((totalTime / (1000)) % 60);

        return {
            'total': totalTime,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return "0" + num;
        } else {
            return num;
        }
    }

    getTimeRemaining();

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.promotion__timer', deadline);

    // modal 

    const modalTriger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        forms = document.querySelectorAll('form'),
        modalContent = document.querySelector('.modal__content');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.overflow = '';
    }

    modalTriger.forEach(item => {
        item.addEventListener('click', () => {
            openModal();
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
        if (e.key === "Enter" && modal.classList.contains('show')) {
            modal.querySelector('button').click();
        }
    });

    modal.addEventListener('mousedown', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    const messageModal = {
        'loading': 'img/form/spinner.svg',
        'success': 'Спасибо! Скоро мы с вами свяжемся',
        'failure': 'Что-то пошло не так...'
    };

    const modalTimerId = setTimeout(openModal, 350000);

    window.addEventListener('scroll', showModalByScroll);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    // Forms 

    const postData = async (url, json) => {
        let result = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        });
        return await result.json();
    };

    function bindPostData() {
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
        
 
                let spinnerModal = document.createElement('img');
                spinnerModal.src = messageModal.loading;
                spinnerModal.style.cssText = `
                    width: 30px;
                    height: 30px;
                    display: block;
                    margin: 0 auto;
                    margin-top: 10px;
            `;

                form.insertAdjacentElement('afterend', spinnerModal);
                modalContent.style.paddingBottom = '12px';
                const formData = new FormData(form);
                const json = JSON.stringify(Object.fromEntries(formData.entries()));

                postData("http://localhost:3000/requests", json)
                    .then(data => {
                        showThanksModal(messageModal.success, form);
                        spinnerModal.remove();
                    }).catch(() => {
                        showThanksModal(messageModal.failure);
                        spinnerModal.remove();
                    }).finally(() => {
                        form.reset();
                    });
            });

        });
    }

    function showThanksModal(message, form) {
        openModal();
        const prevModalDialog = document.querySelector('.modal__dialog');
        modalContent.style.paddingBottom = '40px';
        prevModalDialog.classList.add('hide');

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${message}</div>
    </div>
    `;
        modal.append(thanksModal);

        setTimeout(() => {
            closeModal();
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            if (form.classList.contains('order__form')) {
                openModal();
            }
        }, 4000);

    }

    bindPostData();

    // GET_CARDS_FROM_JSON

    class MenuCard {
        constructor(img, alt, title, descr, price, parentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 3.1;
            this.changeToBlr();
            this.parentSelector = document.querySelector(parentSelector);
            this.classes = classes;
        }

        changeToBlr() {
            this.price = (this.price * this.transfer).toFixed();
        }

        render() {
            let card = document.createElement('div');

            if (this.classes.length === 0) {
                card.classList.add('menu__item');
            } else {
                classes.forEach(item => {
                    card.classList.add(item);
                });
            }

            card.innerHTML = `
                <img src="${this.img}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}"</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> BLR/day</div>
                </div>
            `;
            this.parentSelector.append(card);
        }
    }

    async function getResource(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status} >:( `);
        }
        return res.json();
    }

    getResource("http://localhost:3000/menu")
        .then((data) => {
            data.forEach(({ img, alt, title, descr, price }) => {
                new MenuCard(img, alt, title, descr, price, ".menu .container").render();
            });
        });



    // Slider

    let offset = 0;
    let sliderIndex = 1;
    const slider = document.querySelector('.offer__slider'),
        slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        sliderCaurosel = document.querySelector('.offer__slider-inner'),
        slideWidth = window.getComputedStyle(slidesWrapper).width,
        dots = [];

    function addIndicatorElements() {
        const indicatorCarousel = document.createElement('div');
        indicatorCarousel.classList.add('carousel-indicators');
        slidesWrapper.style.overflow = 'hidden';
        sliderCaurosel.style.cssText = `
            display: flex;
            transition: 0.5s all;
    `;
        sliderCaurosel.style.width = 100 * slides.length + "%";
        indicatorCarousel.style.cssText = `
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 15;
            display: flex;
            justify-content: center;
            margin-right: 15%;
            margin-left: 15%;
            list-style: none;
        `;

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.setAttribute('data-slide-to', i + 1);
            dot.style.cssText = `
                box-sizing: content-box;
                flex: 0 1 auto;
                width: 30px;
                height: 6px;
                margin-right: 3px;
                margin-left: 3px;
                cursor: pointer;
                background-color: #fff;
                background-clip: padding-box;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                opacity: .5;
                transition: opacity .6s ease;
            `;

            indicatorCarousel.append(dot);
            dots.push(dot);
        }

        dots[0].style.opacity = '1';
        slider.style.position = 'relative';
        slider.append(indicatorCarousel);
    }

    function addDotsFunc() {
        dots.forEach(elem => {
            elem.addEventListener('click', (e) => {
                pauseSlider();
                dots.forEach((elem) => {
                    elem.style.opacity = '0.6';
                });
                elem.style.opacity = '1';
                const slideTo = +e.target.getAttribute('data-slide-to');
                sliderIndex = slideTo;
                sliderCaurosel.style.transform = `translateX(-${deleteDigits(slideWidth) * (sliderIndex - 1)}px)`;
                current.innerHTML = setZeroIfless10(sliderIndex);
                resumeSlider();
            });
        });
    }

    function deleteDigits(str) {
        return +str.replace(/\D/g, "");
    }

    function setZeroIfless10(num) {
        return (num < 10) ? `0${num}` : num;
    }

    function totalCounterSet() {
        total.innerHTML = setZeroIfless10(slides.length);
    }



    current.innerHTML = setZeroIfless10(sliderIndex);

    let pause = false;
    let unPause;
    function resumeSlider() {
        unPause = setTimeout(() => {
            pause = false;
        }, 3000);
    }

    function pauseSlider() {
        pause = true;
        clearInterval(unPause);
    }

    function goNextSlider() {
        if (offset === deleteDigits(slideWidth) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteDigits(slideWidth);
        }

        sliderCaurosel.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex === slides.length) {
            sliderIndex = 1;
        } else {
            sliderIndex++;
        }

        current.innerHTML = setZeroIfless10(sliderIndex);
        dots.forEach(elem => elem.style.opacity = '.5');
        dots[sliderIndex - 1].style.opacity = '1';
    }

    next.addEventListener('click', () => {
        pauseSlider();
        goNextSlider();
        resumeSlider();
    });

    prev.addEventListener('click', () => {
        pauseSlider();
        if (offset === 0) {
            offset = deleteDigits(slideWidth) * (slides.length - 1);
        } else {
            offset -= deleteDigits(slideWidth);
        }

        sliderCaurosel.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex === 1) {
            sliderIndex = slides.length;
        } else {
            sliderIndex--;
        }

        current.innerHTML = setZeroIfless10(sliderIndex);
        dots.forEach(elem => elem.style.opacity = '.5');
        dots[sliderIndex - 1].style.opacity = '1';

        resumeSlider();
    });

    addIndicatorElements();
    addDotsFunc();
    totalCounterSet();

    const autoSlider = setInterval(() => {
        if (!pause) {
            goNextSlider();
        }
    }, 3000);

    // Calc

    let sex = 'female',
        ratio = 1.2,
        height, weight, age;

    const result = document.querySelector('.calculating__result span');

    function calcTotal() {
        if (!sex || !ratio || !height || !width || !age) {
            result.innerHTML = '_____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round(88.36 + ((13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = +e.target.getAttribute('id');
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

        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.addEventListener('input', () => {
                if (elem.value.match(/\D/g)) {
                    elem.style.border = '1px solid red';
                } else {
                    elem.style.border = 'none'; 
                } 
                
                switch (elem.getAttribute('id')) {
                    case 'height': height = +elem.value;
                        break;
                    case 'weight': weight = +elem.value;
                        break;
                    case 'age': age = +elem.value;
                        break;
                }
                calcTotal();
            });
        });

    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
    getDynamicInformation('.calculating__choose_medium input');
});