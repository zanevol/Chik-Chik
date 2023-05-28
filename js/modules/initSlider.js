import {addPreloader, removePreloader} from "./util.js";
const startSlider = sliderContainer => {
    const sliderList = sliderContainer.querySelector('.slider__list');
    const sliderItems = sliderList.querySelectorAll('.slider__item');
    const btnNextSlide = sliderContainer.querySelector('.btn__right');
    const btnPrevSlide = sliderContainer.querySelector('.btn__left');
    let activeSlide = 1;
    let position = 0;

    const checkSlider = () => {
        if ((activeSlide + 2 === sliderItems.length && document.documentElement.offsetWidth > 480) || activeSlide === sliderItems.length) {
            btnNextSlide.style.display = 'none';
        } else {
            btnNextSlide.style.display = '';
        }

        if (activeSlide === 1) {
            btnPrevSlide.style.display = 'none';
        } else {
            btnPrevSlide.style.display = '';
        }
    }
    checkSlider();
    const nextSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');
        position = -sliderItems[0].clientWidth * activeSlide;
        sliderList.style.transform = `translateX(${position}px)`;
        activeSlide += 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    }
    const prevSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');
        position = -sliderItems[0].clientWidth * (activeSlide - 2);
        sliderList.style.transform = `translateX(${position}px)`;
        activeSlide -= 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    }

    btnNextSlide.addEventListener('click', nextSlide);
    btnPrevSlide.addEventListener('click', prevSlide);

    window.addEventListener('resize', () => {
        if (activeSlide + 2 > sliderItems.length && document.documentElement.offsetWidth > 480) {
            activeSlide = sliderItems.length - 2;
            sliderItems[activeSlide]?.classList.add('slider__item_active');
        }
        position = -sliderItems[0].clientWidth * (activeSlide - 1);
        sliderList.style.transform = `translateX(${position}px)`;
        checkSlider();
    })
}
export const initSlider = () => {
    const slider = document.querySelector('.slider');
    const sliderContainer = slider.querySelector('.slider__container');

    sliderContainer.style.display = 'none';
    addPreloader(slider);
    window.addEventListener('load', () => {
        sliderContainer.style.display = '';
        removePreloader(slider);
        startSlider(sliderContainer);
    })
}