class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(recipeId, title, author, img) {
        const like = { recipeId, title, author, img };
        this.likes.push(like);
        this.persistData();
        return like;
    }

    deleteLike(recipeId) {
        this.likes.splice(this.likes.findIndex(el => el.recipeId === recipeId), 1);
        this.persistData();
    }

    isLiked(recipeId) {
        return this.likes.findIndex(el => el.recipeId === recipeId) !== -1;
    }

    getNumberLike() {
        return this.likes.length;
    }

    //Persist data in local storage
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    
    // Restore likes from local storage
    readStorage() {
        const storageData = JSON.parse(localStorage.getItem('likes'));
        if (storageData) this.likes = storageData;
    }
}

export default Likes;