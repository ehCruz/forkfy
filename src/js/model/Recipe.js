import axios from 'axios';
import { API_KEY, PROXY_CORS } from '../Constantes';

class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getResult() {
        try {
            const result = await axios(`${PROXY_CORS}https://www.food2fork.com/api/get?key=${API_KEY}&rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.image = result.data.recipe.image_url;
            this.source = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
            this.calcTime();
            this.calcServing();
            this.parseIngredients();
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        this.time = this.ingredients.length * 5;
    }

    calcServing() {
        this.serving = 4;
    }

    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g']
        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitShort[index]);
            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Parse ingredient into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            // findIndex() retorna o index do elemento caso a função callback retorne true, caso contrário retorna -1
            // includes() retorna true caso o elemento exista dentro do array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let obj;
            if (unitIndex > -1) {
                //there is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval('4+1/2') === 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount === 1) {
                    console.log(arrIng[0])
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    console.log(arrIng.slice(0, unitIndex).join('+'));
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                obj = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit, but first element is a Number
                // Ex. 1 coup of water
                obj = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // there is no units at all
                obj = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }
            return obj;
        });
        this.ingredients = newIngredients;
    }

    /**
     * 
     * @param {String} type "increase" ou "decrease" serving 
     */
    updateServings(type) {
        // update serving
        const newServings = type === 'decrease' ? this.serving - 1 : this.serving + 1;
        // Update ingredients
        this.ingredients.forEach(el => {
            el.count *= (newServings / this.serving); 
        });
        this.serving = newServings;
    }
}

export default Recipe;