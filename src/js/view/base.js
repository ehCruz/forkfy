export const domElements = {
    resListMain: document.querySelector('.results'),
    formSearch: document.querySelector('.search'),
    inputSearch: document.querySelector('.search__field'),
    resListSearch: document.querySelector('.results__list'),
    searchPagination: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    listShopping: document.querySelector('.shopping__list'),
    listRemoveAll: document.querySelector('.shopping__remove'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
}

export const elementsStrings = {
    loader: 'loader',
    buttonInLine: 'btn-inline',
};

/**
 * 
 * @param {Element} parent parent element where the loader should be inserted  
 */
export const loaderSpinner = parent => {
    const loader = `<div class="${elementsStrings.loader}">
                        <svg>
                            <use href="img/icons.svg#icon-cw"></use>
                        </svg>
                    </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoaderSpinner = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    // Para remover um elemento é necessário sempre "subir" até o parentElement e aí remover o childElement 
    if (loader)
        loader.parentElement.removeChild(loader);
};

export const clearHTML = el => {
    el.innerHTML = '';
};