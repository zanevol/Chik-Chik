import {addPreloader, removePreloader} from "./util.js";
import {API_URL} from "./const.js";

const renderPrice = (wrapper, data) => {
    data.forEach(item => {
        wrapper.insertAdjacentHTML('beforeend', `
            <div class="price__item">
                <p class="price__text">${item.name}</p>
                <p class="price__cost">${item.price} руб</p>
            </div>
        `)
    })
    wrapper.insertAdjacentHTML('beforeend', `
        <a href="#reserve" class="price__link main-link">Записаться</a>
    `)
}
const renderServices = (wrapper, data) => {
    data.forEach(item => {
        wrapper.insertAdjacentHTML('beforeend', `
            <label class="radio">
                <input class="radio__input" type="radio" name="service" value="${item.id}">
                <span class="radio__title">${item.name}</span>
            </label>
        `)
    })
    wrapper.insertAdjacentHTML('beforebegin', `
        <legend class="reserve__legend">Услуга</legend>
    `)
}
export const initService = () => {
    const priceList = document.querySelector('.price__list');
    const reserveForm = document.querySelector('.reserve__form');
    const serviceWrapper = reserveForm.elements[0];

    priceList.textContent = '';
    serviceWrapper.textContent = '';

    addPreloader(priceList);
    fetch(`${API_URL}/api`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                renderPrice(priceList, data);
                removePreloader(priceList);
                renderServices(serviceWrapper, data);
            }
        })
}