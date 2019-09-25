axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems);
  });
    
document.addEventListener('DOMContentLoaded', function() {
    var elem = document.querySelectorAll('.modal');
    var instance = M.Modal.init(elem);
  });
    

class User {
    constructor() {
        this.username = 'boogers'
        this.weight = 0
        this.height = 0
        this.age = 0
        this.activity = 0
        this.carb_goal = 0
        this.fat_goal = 0
        this.protein_goal = 0
        this.daily_calorie = 0
    }
};

class Recipe {
    constructor() {
        this.url = ''
        this.image = ''
        this.calories = 0
        this.cooktime = 0
    }
};

const app = new Vue({
    el: '#app',
    delimiters: ['${', '}'], // set custom delimiters here instead of {{}}    
    data: {
        owner: new User,
        recipe: new Recipe(),
        cal_tot: 0,
        meals: [],
        meal: '',
        cal_in: '',
        goal: 2000,
        remaining_cal: 0,
        ingr_one: '',
        ingr_two: '',
        ingr_three: '',
        ingr_four: '',
        search_cals: 0,
        api: 'https://api.edamam.com/search',
        app_id: '&app_id=',
        app_key: '&app_key=',

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
            this.goal = this.owner.daily_calorie
            this.remaining_cal = this.goal - this.cal_tot
        },
        getOwner: async function() {
            const response = await axios.get('api/user/')
            console.log('boogers', response)

            var USER = response.data
            // this.owner = USER
            this.owner.username = USER['username']
            this.owner.weight = USER['weight']
            this.owner.height = USER['height']
            this.owner.age = USER['age']
            this.owner.activity = USER['activity']
            this.owner.carb_goal = USER['carb_goal']
            this.owner.fat_goal = USER['fat_goal']
            this.owner.protein_goal = USER['protein_goal']
            this.owner.daily_calorie = USER['daily_calorie']
        },

        modOwner: async function() {
            var modUser = {
            'weight' : this.owner.weight,
            'height' : this.owner.height,
            'age' : this.owner.age,
            'activity' : this.owner.activity,
            'carb_goal' : this.owner.carb_goal,
            'fat_goal' : this.owner.fat_goal,
            'protein_goal' : this.owner.protein_goal,
            'daily_calorie' : this.owner.daily_calorie
            }
            const response = await axios.post('api/user/', modUser)
            console.log(response)
        },

        // suggestion api
        suggestion: async function() {
            // will use _search_hits to find best match

            // if ingredients are entered then will colate them
            var ingredients = []
            if (this.ingr_one) { ingredients.push(this.ingr_one)}
            if (this.ingr_two) { ingredients.push(this.ingr_two)}
            if (this.ingr_three) { ingredients.push(this.ingr_three)}
            if (this.ingr_four) { ingredients.push(this.ingr_four)}
            var ingr = '?q=' + ingredients.join()

            // if search cals blank then use remaining cals
            var cals = 0
            if (this.search_cals !== 0){
                cals = this.search_cals
            } else {
                cals = this.remaining_cal
            }
            var rCals = '&calories=' + cals
            
            // TODO add in diet restrictions
            get = this.api + ingr + this.app_id + this.app_key + rCals
            const response = await axios.get(get)
            console.log(response)
            this.recipe.url = response.data.hits[0].recipe.url
            this.recipe.image = response.data.hits[0].recipe.image
            this.recipe.calories = response.data.hits[0].recipe.calories
            this.recipe.cooktime = response.data.hits[0].recipe.totalNutrients.totalTime
            console.log(this.recipe)
        },

        _search_hits: function(hits) {
            // This takes in 10 recipe hits from API and searches for most relevent
            var img = hits[0].recipe.image
            var cal = hits[0].recipe.calories
            var cooktime = hits[0].recipe.totalNutrients.totalTime
            var fat = hits[0].recipe.digest['Fat']
            var carb = hits[0].recipe.digest['Carbs']
            var pro = hits[0].recipe.digest['Protein']
        },

        // grabs api keys
        getkeys: async function() {
            const response = await axios.get('api/keys/')
            this.app_id += response.data.api_id
            this.app_key += response.data.api_key
        }
    },
    mounted: function() {
        // USER assigned in base.html
        this.getOwner()
        this.getkeys()
        this.cal_tot = 0
        this.getMeal()
    }
});
