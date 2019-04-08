import { domElements } from './base';

export const toggleLikeButton = isLiked => {
    //icons.svg#icon-heart-outlined
    const icon = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${icon}`);
};

export const toggleLikeMenu = numLikes => {
    domElements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLikes = like => {
    const html = `
        <li>
            <a class="likes__link" href="#${like.recipeId}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>    
    `;
    domElements.likesList.insertAdjacentHTML('beforeend', html);
}

export const deleteLikeFromList = id => {
    const el = document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}