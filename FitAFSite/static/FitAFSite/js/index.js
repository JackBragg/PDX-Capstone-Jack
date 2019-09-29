axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var drop_instances = M.Dropdown.init(elems);
  });
    
document.addEventListener('DOMContentLoaded', function() {
    var elem = document.querySelectorAll('.modal');
    var modal_instance = M.Modal.init(elem);
  });
    

class User {
    constructor() {
        this.username = 'Default'
        this.gender = undefined
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
        // this is to keep remove_meal(org_index) working, do not access in model
        this.org_index = 0
        this.title = ''
        this.url = ''
        this.image = ''
        this.calories = 1
        this.cooktime = 0
        this.servings = 1
        this.fat = 0.0
        this.carb = 0.0
        this.pro = 0.0
        this.meal_time = 'breakfast'

        this.cals_consumed = 0
    }

    eaten_cals() {
        // if (!this.cals_consumed) {    
        if ((this.calories > 0) && (this.servings > 0)){
            this.cals_consumed = Math.floor(this.calories * this.servings)     
        } else {
            this.cals_consumed = this.calories
            this.servings = 1
        }
        // }
        return this.cals_consumed
        
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
        breakfast_meals: [],
        snack1_meals: [],
        lunch_meals: [],
        snack2_meals: [],
        dinner_meals: [],
        night_snack_meals: [],
        meal: new Recipe(),
        goal: 2000,
        remaining_cal: 0,
        ingr_one: '',
        ingr_two: '',
        ingr_three: '',
        ingr_four: '',
        search_cals: 0,
        modal_servings: 1,
        _modal_data: null,
        api: 'https://api.edamam.com/search',
        app_id: '&app_id=',
        app_key: '&app_key=',

    },
    methods: {
        addMeal: async function(meal_time_in=0) {
            if (meal_time_in) {
                this.meal.meal_time = meal_time_in
            } else {
                this.meal.meal_time = 'breakfast'
            }
            if (this.cal_tot) {
                this.cal_tot += this.meal.eaten_cals()
            }
            const response = await axios.post('api/meal/', this.meal)
            console.log('get resp', response)
            // // add meal to this.meals
            // this.meals.push({text: this.meal, completed: false})
            this.meal = new Recipe()
            this.getMeal()
        },
        removeMeal: async function(index) {
            console.log('passed index', index)
            this.cal_tot -= this.meals[index].eaten_cals()
            const response = await axios.delete(`api/meal/${this.meals[index].pk}/`)
            console.log(response)            
            this.getMeal()
        },

        getMeal: async function() {
            const response = await axios.get('api/meal/')
            // console.log('resp', response)
            this.meals = response.data
            // if page load add all together
            if (!this.cal_tot) {
                for (meal in this.meals) {
                    this.cal_tot += this.meals[meal].calories
                }
            }
            for (i=0; i < this.meals.length; i++) {
                this.meals[i] = this.conv_meal(this.meals[i], i)
                // assigns meals to meal times
                console.log('bf', this.meals[i])
                if (this.meals[i].meal_time === 'breakfast'){
                    this.breakfast_meals.push(this.meals[i])
                }
                switch (this.meals[i].meal_time) {
                    case 'breakfast':
                        this.breakfast_meals.push(this.meals[i]);
                        break;
                    case 'snack1':
                        this.snack1_meals.push(this.meals[i]);
                        break;
                    case 'lunch':
                        this.lunch_meals.push(this.meals[i]);
                        break;
                    case 'snack2':
                        this.snack2_meals.push(this.meals[i]);
                        break;
                    case 'dinner':
                        this.dinner_meals.push(this.meals[i]);
                        break;
                    case 'night_snack':
                        this.night_snack_meals.push(this.meals[i]);
                        break;
                }
            }
            // console.log('meals', this.meals)
            this.goal = this.owner.daily_calorie
            this.remaining_cal = this.goal - this.cal_tot
        },

        conv_meal: function(meal_in, org_index) {
            var temp = new Recipe()
            // this is to keep remove_meal(org_index) working, do not access in model
            temp.org_index = org_index
            temp.pk = meal_in.pk
            temp.title = meal_in.title
            temp.url = meal_in.url
            temp.image = meal_in.image
            temp.calories = meal_in.calories
            temp.cooktime = meal_in.cooktime
            temp.servings = meal_in.servings
            temp.fat = meal_in.fat
            temp.carb = meal_in.carb
            temp.pro = meal_in.pro
            temp.meal_time = meal_in.meal_time
            temp.eaten_cals()
            return temp
        },

        getOwner: async function() {
            const response = await axios.get('api/user/')
            console.log('users api call', response)

            var USER = response.data
            // this.owner = USER
            this.owner.username = USER['username']
            this.owner.gender = USER['gender']
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
            if (!this.owner.daily_calorie) {
                if (this.owner.gender != null) {
                    if (this.owner.gender) {
                        var BMR = 66 + (6.3*this.owner.weight) + (12.9 * this.owner.height) - (6.8 * this.owner.age)
                    } else {
                        var BMR = 655 + (4.3 * this.owner.weight) + (4.7 * this.owner.height) - (4.7 * this.owner.age)
                    }
                    if (this.owner.activity) {
                        this.owner.daily_calorie = Math.round(BMR * this.owner.activity)
                    }
                } else {
                    alert ('Daily caloric intake cannot be calculated unless a gender is selected')
                }
            }
            var modUser = {
            'weight' : this.owner.weight,
            'height' : this.owner.height,
            'age' : this.owner.age,
            'activity' : this.owner.activity,
            'carb_goal' : this.owner.carb_goal,
            'fat_goal' : this.owner.fat_goal,
            'protein_goal' : this.owner.protein_goal,
            'daily_calorie' : this.owner.daily_calorie,
            'gender' : this.owner.gender
            }
            const response = await axios.post('api/user/', modUser)
            console.log(response)
        },

        // suggestion api
        suggestion: async function() {
            // will use _parse_recipies to find best match

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
            // Edamam API call
            get = this.api + ingr + this.app_id + this.app_key + rCals
            const response = await axios.get(get)
            
            // Filter results
            this.recipe = this._parse_recipes(response.data.hits)
            console.log(this.recipe)
        },

        add_sugg_to_meal: function() {
            pass
        },

        serv_modal_func: function(serv_index) {
            this._modal_data = serv_index
            // console.log('index', this._modal_data)
        },

        set_clear_serv_modal_data: async function() {
            // cal_tot needs to be changed before it is converted to a new obj
            console.log(this.meals[this._modal_data].eaten_cals())
            this.meal = this.conv_meal(this.meals[this._modal_data])
            // this.meal.pk = this.meals[this._modal_data].pk
            // console.log(this.meal.pk)
            this.meal.servings = this.modal_servings
            
            // delete old entry
            this.cal_tot -= this.meals[this._modal_data].eaten_cals()
            const response = await axios.delete(`api/meal/${this.meal.pk}/`)
            console.log(response)
            this.addMeal()

            this._modal_data = null
            this.modal_servings = 1
        },

        _parse_recipes: function(hits) {
            // This takes in 10 recipe hits from API and searches for most relevent
            var closest = new Recipe()
            var recipes = []
            // builds list of recipes
            for (i=0; i < hits.length; i++) {
                var rcp = new Recipe()
                rcp.url = hits[i].recipe.url
                rcp.image = hits[i].recipe.image
                rcp.calories = hits[i].recipe.calories
                rcp.cooktime = hits[i].recipe.totalNutrients.totalTime
                rcp.servings = hits[i].recipe.yield
                rcp.fat = hits[i].recipe.digest['Fat']
                rcp.carb = hits[i].recipe.digest['Carbs']
                rcp.pro = hits[i].recipe.digest['Protein']
                recipes.push(rcp)
            }
            // finds most ideal match based on cals
            closest = recipes[0]
            if (recipes.length > 1) {
                for (i=1; i < recipes.length; i++){
                    var cl_dist = this.remaining_cal - closest.eaten_cals()
                    var nxt_dist = this.remaining_cal - recipes[i].eaten_cals()
                    console.log('closest', cl_dist, 'next', nxt_dist)
                    if (cl_dist > nxt_dist) {
                        // if this recipe is closer to the remaining cals then use this
                        closest = recipes[i]
                    }
                }
            }
            return closest

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
        // Only uncomment this when finished! otherwise it will exceed api limit!!!!!!!!!!
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // this.suggestion()
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
});