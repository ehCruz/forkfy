import Search from './model/Search';
import Recipe from './model/Recipe';
import ShoppingList from './model/ShoppingList';
import Likes from './model/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as shoppingListView from './view/shoppingListView';
import * as likesView from './view/likesView';
import * as base from './view/base';

/**
 * Global state of the app
 * 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * Função controller da pesquisa
 */
const controllSearch = async () => {
    // 1 - Get query from the view
    const query = searchView.getInputSearch();
    if (query) {
        // 2 - new Search object and add to the state
        state.search = new Search(query);
        // 3 - Prepare the user interface
        searchView.clearFields();
        // searchView.clearResultList();
        base.clearHTML(base.domElements.resListSearch);
        base.clearHTML(base.domElements.searchPagination);
        base.loaderSpinner(base.domElements.resListMain);
        // 4 - Search for recipes
        try {
            await state.search.getResult();
            // 5 - Render result on the UI
            base.clearLoaderSpinner();
            searchView.renderResults(state.search.results);
        } catch (error) {
            alert(error)
            base.clearLoaderSpinner();
        }
    }
};

/**
 * Função controller da Recipe
 */

const controllRecipe = async () => {
    const recipeID = window.location.hash.replace('#', '');
    if (recipeID) {
        // Prepare UI for changes
        base.clearHTML(base.domElements.recipe);
        base.loaderSpinner(base.domElements.recipe);
        searchView.highlightSelectedRecipe(recipeID);
        // Create new Recipe Object
        state.recipe = new Recipe(recipeID);
        try {
            // Get Recipe Data
            await state.recipe.getResult();
            // Render the recipe
            base.clearLoaderSpinner();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(recipeID));
        } catch (error) {
            alert(error)
            base.clearLoaderSpinner();
        }
    }
};

/**
 * Shopping list Controller
 */
const listController = (isSingleIngredient, id = 0) => {
    // Cria uma nova lista se ainda não existir um
    if (isSingleIngredient) {
        shoppingListView.renderItem(state.shopping.addItem(
            state.recipe.ingredients[id].count,
            state.recipe.ingredients[id].unit,
            state.recipe.ingredients[id].ingredient
        ));
    } else {
        state.recipe.ingredients.forEach(el => shoppingListView.renderItem(state.shopping.addItem(el.count, el.unit, el.ingredient)));
    }
    shoppingListView.renderDeleteAllButton();
    state.shopping.persistData();
}

window.l = state;

/**
 * Like controller
 */
const likeController = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state and Add UI list
        likesView.renderLikes(state.likes.addLike(
            state.recipe.id,
            searchView.limitRecipeTitle(state.recipe.title),
            state.recipe.author,
            state.recipe.image
        ));
        // Toggle like button
        likesView.toggleLikeButton(true);
    } else {
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle like button
        likesView.toggleLikeButton(false);
        // Remove UI list
        likesView.deleteLikeFromList(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumberLike());
}


/**
 * Event listners
 */
//evento botão de pesquisa
base.domElements.formSearch.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});

/**
 * Hash change eventlistener
 * EventListener para seleção da receita
 * OnLoad Window eventlistener
 * EventListener para seleção da receita caso recarregue a página
 */
//window.addEventListener('hashchange', controllRecipe);
//window.addEventListener('load', controllRecipe);
['hashchange', 'load'].forEach(e => window.addEventListener(e, controllRecipe));

//evento botão paginação,usando event delegation
base.domElements.searchPagination.addEventListener('click', e => {
    const button = e.target.closest(`.${base.elementsStrings.buttonInLine}`);
    if (button) {
        const page = parseInt(button.dataset.page, 10);
        base.clearHTML(base.domElements.resListSearch);
        base.clearHTML(base.domElements.searchPagination);
        searchView.renderResults(state.search.results, page);
    }
});

// Handling recipe button clicks
base.domElements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease
        if (state.recipe.serving > 1) {
            state.recipe.updateServings('decrease');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase
        state.recipe.updateServings('increase');
        recipeView.updateServingIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredientes a lista de compras
        listController(false);
    } else if (e.target.matches('.recipe__add-ingredient, .recipe__add-ingredient *')) {
        let id = e.target.closest('.recipe__item').dataset.ingredient;
        listController(true, id);
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like recipe button
        likeController();
    }
});

// Handling shopping list button clicks
base.domElements.listShopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.id;
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // deleta elemento da state
        state.shopping.deleteItem(id);
        state.shopping.persistData();
        // update UI
        shoppingListView.deleteItem(id);
        if (state.shopping.getTotalElementsOnList() === 0) shoppingListView.deleteRemoveAll();
    } else if (e.target.matches('.shopping__count-value')) {
        const value = parseFloat(e.target.value, 10);
        state.shopping.updateItem(id, value);
        state.shopping.persistData();
    }
});

base.domElements.listRemoveAll.addEventListener('click', e => {
    if (e.target.matches('.shopping__remove-all, .shopping__remove-all *')) {
        // Deleta todos os itens do array
        state.shopping.deleteAllItens();
        // Update na UI
        shoppingListView.deleteAllItens();
        shoppingListView.deleteRemoveAll();
        state.shopping.persistData();
    }
});

window.addEventListener('load', () => {
    /**
     * OnLoad event para carregar a lista de likes 
     */
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumberLike());
    state.likes.likes.forEach(el => likesView.renderLikes(el));
    /**
     * OnLoad event para carregar a lista de compras
     */
    state.shopping = new ShoppingList();
    state.shopping.getPersistedData();
    if (state.shopping.getTotalElementsOnList() > 0) {
        state.shopping.itens.forEach(el => shoppingListView.renderItem(el));
        shoppingListView.renderDeleteAllButton();
    }
});