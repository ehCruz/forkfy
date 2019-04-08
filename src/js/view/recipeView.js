import { domElements } from './base';
import { Fraction } from 'fractional';

export const renderRecipe = (recipe, isLiked) => {
    const html = `
            <figure class="recipe__fig">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.serving}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? '': '-outlined'}"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map((el, index) => createIngredientElement(index,el)).join('')}
                </ul>

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.source}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </a>
            </div>
    `;
    domElements.recipe.insertAdjacentHTML('afterbegin', html);
}

export const updateServingIngredients = recipe => {
    // Update serving
    document.querySelector('.recipe__info-data--people').textContent = recipe.serving;
    // Update ingredients
    Array.from(document.querySelectorAll('.recipe__count')).forEach((el, index) => {
        el.textContent = formatCount(recipe.ingredients[index].count);
    });
};

const createIngredientElement = (index, ingredient) => `
    <li class="recipe__item" data-ingredient="${index}">
        <div class="recipe__item-description">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${formatCount(ingredient.count)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.ingredient}
            </div>
        </div>
        <button class="recipe__add-ingredient btn-tiny" title="Add ${ingredient.ingredient} to your shopping list!">
            <svg aria-label="Add ${ingredient.ingredient} to your shopping list!">
                <use href="img/icons.svg#icon-circle-with-plus"></use>
            </svg>
        </button>
    </li>`;

const formatCount = value => {
    if (value) {
        // value = 2.5 --> 2 1/2
        // value = 0.5 --> 1/2
        const newValue = Math.round(value * 1000) / 1000;
        // Desctructuring
        const [integerPart, decimalPart] = newValue.toString().split('.').map(el => parseInt(el, 10));
        if (!decimalPart) return newValue;
        if (integerPart === 0) {
            const fraction = new Fraction(newValue);
            return `${fraction.numerator}/${fraction.denominator}`;
        } else {
            const fraction = new Fraction(newValue - integerPart);
            return `${integerPart} ${fraction.numerator}/${fraction.denominator}`;
        }
    }
    return ``;
};