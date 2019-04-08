import { domElements } from './base';

export const renderItem = item => {
    const html = `
        <li class="shopping__item" data-id="${item.id}">
            <div class="shopping__count">
                <input class="shopping__count-value" type="number" value="${item.count}" step="${item.count}">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    domElements.listShopping.insertAdjacentHTML('beforeend', html);
};

export const deleteItem = id => {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) el.parentElement.removeChild(el);
};

export const renderDeleteAllButton = () => {
    const elExist = document.querySelector('.shopping__remove-all');
    if (!elExist) {
        const html = `
        <button class="shopping__remove-all btn-tiny">
            <p>Remover todos os itens</p>
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    `;
        domElements.listRemoveAll.insertAdjacentHTML('afterbegin', html);
    }
};

export const deleteAllItens = () => {
    domElements.listShopping.innerHTML = '';
}

export const deleteRemoveAll = () => {
    domElements.listRemoveAll.innerHTML = '';
}