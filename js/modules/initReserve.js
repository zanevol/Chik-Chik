import {addPreloader, removePreloader} from "./util.js";
import {API_URL, year} from "./const.js";

const renderSpec = (wrapper, data) => {
    data.forEach(item => {
        wrapper.insertAdjacentHTML('beforeend', `
            <label class="radio">
                <input class="radio__input" type="radio" name="spec" value="${item.id}">
                <span class="radio__title photo__title">
                    <img loading="lazy" decoding="async" class="radio__photo" src="${API_URL}${item.img}" alt="smallPhoto">
                        ${item.name}
                     </span>
            </label>
        `)
    })
}

const renderMonth = (wrapper, data) => {
    data.forEach(item => {
        wrapper.insertAdjacentHTML('beforeend', `
            <label class="radio">
                <input class="radio__input" type="radio" name="month" value="${item}">
                <span class="radio__title">${new Intl.DateTimeFormat('ru-RU', {month: "long"}).format(new Date(year, item))}</span>
            </label>
        `)
    })
}

const renderDay = (wrapper, data, month) => {
    data.forEach(item => {
        wrapper.insertAdjacentHTML('beforeend', `
            <label class="radio">
                <input class="radio__input" type="radio" name="day" value="${item}">
                <span class="radio__title">${new Intl.DateTimeFormat('ru-RU', {
            month: "long",
            day: "numeric"
        }).format(new Date(year, month, item))}</span>
            </label>
        `)
    })
}

const renderTime = (wrapper, data) => {
    data.forEach(item => {
        wrapper.insertAdjacentHTML('beforeend', `
            <label class="radio">
                <input class="radio__input" type="radio" name="time" value="${item}">
                <span class="radio__title">${item}</span>
            </label>
        `)
    })
}

// Оформление записи

const addDisabled = arr => {
    arr.forEach(elem => elem.disabled = true);
}

const removeDisabled = arr => {
    arr.forEach(elem => elem.disabled = false);
}
export const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form');
    addDisabled(
        [
            ...reserveForm.elements['spec'],
            ...reserveForm.elements['day'],
            ...reserveForm.elements['month'],
            ...reserveForm.elements['time'],
            reserveForm.btn
        ]);

    console.log(reserveForm);

    reserveForm.addEventListener('change', async e => {
        const target = e.target;
        if (target.name === 'service') {
            addPreloader(reserveForm.elements[10]);
            const response = await fetch(`${API_URL}/api?service=${target.value}`);
            const data = await response.json();
            reserveForm.elements[10].innerHTML = '<legend class="reserve__legend">Специалист</legend>';
            renderSpec(reserveForm.elements[10], data);
            removePreloader(reserveForm.elements[10]);
        }
        if (target.name === 'spec') {
            addPreloader(reserveForm.fieldmonth);
            const response = await fetch(`${API_URL}/api?spec=${target.value}`);
            const data = await response.json();
            reserveForm.fieldmonth.textContent = '';
            renderMonth(reserveForm.fieldmonth, data);
            removePreloader(reserveForm.fieldmonth);
        }
        if (target.name === 'month') {
            addPreloader(reserveForm.fieldday);
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${target.value}`);
            const data = await response.json();
            reserveForm.fieldday.textContent = '';
            renderDay(reserveForm.fieldday, data, target.value);
            removePreloader(reserveForm.fieldday);
        }
        if (target.name === 'day') {
            addPreloader(reserveForm.fieldtime);
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
            const data = await response.json();
            reserveForm.fieldtime.textContent = '';
            renderTime(reserveForm.fieldtime, data);
            removePreloader(reserveForm.fieldtime);
        }
        if (target.name === 'time') {
            removeDisabled([reserveForm.btn])
        }
    })

    reserveForm.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(reserveForm);
        const json = JSON.stringify(Object.fromEntries(formData));

        const response = await fetch(`${API_URL}api/order`, {
            method: 'POST',
            body: json
        })
        const data = await response.json();
        addDisabled(
            [
                ...reserveForm.elements['service'],
                ...reserveForm.elements['spec'],
                ...reserveForm.elements['day'],
                ...reserveForm.elements['month'],
                ...reserveForm.elements['time'],
                reserveForm.btn
            ]);
        const message = document.createElement('p');
        message.classList.add('reserve__message');
        message.textContent = `
            Спасибо, Ваш заказ № ${data.id}!
            Ждем Вас ${new Intl.DateTimeFormat('ru-RU', {
                month: 'long',
                day: 'numeric'
            }).format(new Date(year, data.month, data.day))},
            время ${data.time}.
        `
        reserveForm.insertAdjacentElement('beforeend', message);
    })
}