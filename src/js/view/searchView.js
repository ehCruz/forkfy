import { domElements, elementsStrings } from './base';

export const getInputSearch = () => domElements.inputSearch.value;
export const clearFields = () => {
    domElements.inputSearch.value = '';
};

/**
 * 
 * @param {Recipes[]} recipes array with all the recipes 
 * @param {Number} page the actual page
 * @param {Number} resultPerPage quantity of results to be display per page
 */
export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    // Render result per page
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // Render search pagination button
    renderPaginationButtons(page, recipes.length, resultPerPage);
};

/**
 * 
 * @param {String} id id da receita
 * 
 * recebe o id da receita, seleciona todos os elementos com a classe .result__link
 * então transforma eles em um array, realiza a iteração nesse array removendo caso exista
 * a classe ativa do elemento, e então adiciona a classe ativa ao elemento selecionado
 */
export const highlightSelectedRecipe = id => {
    const recipeList = Array.from(document.querySelectorAll('.results__link'));
    recipeList.forEach(el => {
        el.classList.remove('results__link--active');
    });
    const el = document.querySelector(`.results__link[href*="#${id}"]`);
    if (el) el.classList.add('result__link--active');
};

/**
 * Limit the recipe title
 * @param {String} title title of the recipe 
 * @param {Number} limit maximum lenght of the title
 */
export const limitRecipeTitle = (title, limit = 17) => {
    const arrNewTitile = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                arrNewTitile.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${arrNewTitile.join(' ')} ...`;
    }
    return title;
};

/**
 * Local Functions
*/

/**
 * Render a recipe
 * @param {Object} recipe - recipe object
 */
const renderRecipe = recipe => {
    const html = `<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;

    domElements.resListSearch.insertAdjacentHTML('beforeend', html);
};

/**
 * 
 * @param {Number} page the actual page
 * @param {Number} numResults total of results from the search
 * @param {Number} numResultsPerPage number of itens that should be displayed per page
 */
const renderPaginationButtons = (page, numResults, numResultsPerPage) => {
    const numOfPages = Math.ceil(numResults / numResultsPerPage);
    let html;
    if (page === 1 && numOfPages > 1) {
        // Apenas botão de próxima página
        html = createPaginationButtonMarkup(page, 'next');
    } else if (page < numOfPages) {
        // Ambos botões de página anterior e próxima
        html = `${createPaginationButtonMarkup(page, 'prev')}
            ${createPaginationButtonMarkup(page, 'next')}`;
    } else if (page === numOfPages && numOfPages > 1) {
        // Apenas botão de página anterior
        html = createPaginationButtonMarkup(page, 'prev');
    }
    domElements.searchPagination.insertAdjacentHTML('afterbegin', html);
};

/**
 * 
 * @param {Number} page the current page
 * @param {String} type can only be 'prev' or 'next' 
 */
const createPaginationButtonMarkup = (page, type) => `
        <button class="${elementsStrings.buttonInLine} results__btn--${type}" data-page="${type === 'prev' ? page - 1 : page + 1}">
        <span>${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        </button>`;

