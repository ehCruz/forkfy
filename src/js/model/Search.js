import axios from 'axios';
import {API_KEY, PROXY_CORS} from '../Constantes';

class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {
        console.log(`https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`);
        try {
            const res = await axios(`${PROXY_CORS}https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`);
            this.results = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            console.log(error);
        }
    }
}

export default Search;