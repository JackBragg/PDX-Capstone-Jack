axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

class Recipe {
    constructor() {
        this.image = ''
        this.calories = 0
    }
}

const app = new Vue({
    el: '#app',
    delimiters: ['${', '}'], // set custom delimiters here instead of {{}}    
    data: {
        cal_tot: 0,
        meals: [],
        meal: '',
        owner: 'default',
        cal_in: '',
        api: 'https://api.edamam.com/search',
        goal: 2000,
        remaining_cal: 0,
        ingredients: ['apple', 'carrot'],
        app_id: '&app_id=',
        app_key: '&app_key=',
        recipe: new Recipe(),

    },
    methods: {
        addMeal: async function() {
            this.cal_in = Number(this.cal_in)
            if (this.cal_tot) {
                this.cal_tot += this.cal_in
            }
            const response = await axios.post('api/meal/', {title: this.meal, calories: this.cal_in})
            console.log(response)
            // // add meal to this.meals
            // this.meals.push({text: this.meal, completed: false})
            this.meal = ''
            this.cal_in = ''
            this.getMeal()
        },
        removeMeal: async function(index) {
            this.cal_tot -= Number(this.meals[index].calorie)
            const response = await axios.delete(`api/meal/${this.meals[index].pk}/`)
            console.log(response)            
            // remove meal from this.meals
            // this.meals.splice(index, 1)
            this.getMeal()
        },
        getMeal: async function() {
            const response = await axios.get('api/meal/')
            this.meals = response.data
            if (!this.cal_tot) {
                for (meal in this.meals) {
                    this.cal_tot += Number(this.meals[meal].calorie)
                }
            }
            this.remaining_cal = this.goal - this.cal_tot
        },
        suggestion: async function() {
            var ingr = '?q=' + this.ingredients.join()
            var rCals = '&calories=' + this.remaining_cal
            get = this.api + ingr + this.app_id + this.app_key + rCals
            const response = await axios.get(get)
            this.recipe.image = response.data.hits[0].recipe.image
            this.recipe.calories = response.data.hits[0].recipe.calories
            console.log(this.recipe)
        },

        getkeys: async function() {
            const response = await axios.get('api/keys/')
            this.app_id += response.data.api_id
            this.app_key += response.data.api_key
        }
    },
    mounted: function() {
        // USER assigned in base.html
        this.owner = USER
        this.getkeys()
        this.cal_tot = 0
        this.getMeal()
    }
});
