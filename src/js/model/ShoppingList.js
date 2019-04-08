import uniqid from 'uniqid';

class ShoppingList {
    constructor() {
        this.itens = [];
    }

    addItem(count, unit, ingredient) {
        let ingredientIndex = this.ingredientExists(ingredient);
        if(ingredientIndex >= 0){
            console.log(this.itens[ingredientIndex])
            this.itens[ingredientIndex].count += count;
            return this.itens[ingredientIndex];
        } else {
            const item = {
                id: uniqid(),
                count,
                unit,
                ingredient
            }
            this.itens.push(item);
            return item;
        }
    }

    deleteItem(idItem) {
        // findIndex retorna o index de um elemento no array
        this.itens.splice(this.itens.findIndex(el => el.id === idItem), 1);
    }

    updateItem(id, newCount) {
        // find retorna o elemento do array, diferente de findIndex
        this.itens.find(el => el.id === id).count = newCount;
    }

    deleteAllItens() {
        this.itens = [];
    }

    getTotalElementsOnList() {
        return this.itens.length;
    }

    persistData() {
        localStorage.setItem('shoppingList', JSON.stringify(this.itens));
    }

    getPersistedData() {
        const data = JSON.parse(localStorage.getItem('shoppingList'));
        if (data) this.itens = data;
    }

    ingredientExists(ingredient) {
        return this.itens.findIndex(el => el.ingredient === ingredient);
    }
}

export default ShoppingList;