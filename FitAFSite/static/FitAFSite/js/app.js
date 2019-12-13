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
        this.created_date = new Date()
        this.title = ''
        this.url = ''
        this.image = ''
        this.meal_calories = 1
        this.calories = 1
        this.cooktime = 0
        this.meal_servings = 1
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
            // console.log('eaten_cals', this.cals_consumed)    
        } else if (this.servings){
            // TODO
            // I want this to create fractions of servings but that also requires
            // calories per serving to be defined

        } else {
            this.cals_consumed = this.calories
            this.servings = 1
        }
        // }
        return this.cals_consumed
        
    }

    // used when importing meals with multiple servings and total cals to
    // determine cals per serving and sub-servings
    define_servings() {
        this.meal_servings = this.servings
        this.meal_calories = this.calories
        if ((this.meal_servings > 1) && (this.meal_calories > 0)) {
            this.servings = 1
            this.calories = Math.floor(this.meal_calories / this.meal_servings)
        }
    }
    
};

const app = new Vue({
    el: '#app',
    delimiters: ['${', '}'], // set custom delimiters here instead of {{}}    
    data: {
        add_meal_modal_data: '',
        breakfast_meals: [],
        cal_tot: 0,
        date: new Date(),
        dinner_meals: [],
        goal: 2000,
        ingr_one: '',
        ingr_two: '',
        ingr_three: '',
        ingr_four: '',
        loading: false,
        lunch_meals: [],
        meal: new Recipe(),
        meal_search: '',
        meals: [],
        modal_data: [],
        modal_recipe: new Recipe(),
        modal_servings: 1,
        night_snack_meals: [],
        owner: new User,
        recipe: new Recipe(),
        remaining_cal: 0,
        snack1_meals: [],
        snack2_meals: [],
        search_cals: null,
        search_cooktime: null,
        search_results: [],
        food_api: 'https://api.edamam.com/api/food-database/parser',
        sugg_api: 'https://api.edamam.com/search',
        recipe_app_id : '&app_id=',
        recipe_app_key : '&app_key=',
        food_app_id : '&app_id=',
        food_app_key : '&app_key=',


    },
    methods: {

        create_add_food: function(meal_in) {
            // this is to keep remove_meal(org_index) working, do not access in model
            this.meal.title = meal_in.food.label
            if (meal_in.food.image != null) {
                this.meal.image = meal_in.food.image
            } else {
                this.meal.image = '{% static "FitAFSite/img/default_meal.jpg" %}'
            }
            this.meal.calories = Math.floor(meal_in.food.nutrients.ENERC_KCAL)
            this.meal.servings = 1
            if (meal_in.food.nutrients.FAT != null){
                this.meal.fat = meal_in.food.nutrients.FAT
            }
            if (meal_in.food.nutrients.CHOCDF != null){
                this.meal.carb = meal_in.food.nutrients.CHOCDF
            }
            if (meal_in.food.nutrients.PROCNT != null){
                this.meal.pro = meal_in.food.nutrients.PROCNT
            }
            this.meal.eaten_cals()
            this.modal_add_meal()
            this.meal_search = ''
        },

        modal_add_meal: function() {
            this.addMeal(this.add_meal_modal_data)
            this.add_meal_modal_data = ''
        },

        addMeal: async function(meal_time_in) {
            this.meal.meal_time = meal_time_in
            console.log('addMeal:', this.meal)
            var input = 'api/meal/' + this.date + '/'
            const response = await axios.post(input, this.meal)
            // // add meal to this.meals
            // this.meals.push({text: this.meal, completed: false})
            this.meal = new Recipe()
            this.getMeal()
        },

        modal_parse_removal_index: function() {
            this.removeMeal(this.modal_data[0])
        },

        parse_removal_index: function(meal_section, index) {
            switch (meal_section) {
                case 'breakfast':
                    this.removeMeal(this.breakfast_meals[index].org_index);
                    break;
                case 'snack1':
                    this.removeMeal(this.snack1_meals[index].org_index);
                    break;
                case 'lunch':
                    this.removeMeal(this.lunch_meals[index].org_index);
                    break;
                case 'snack2':
                    this.removeMeal(this.snack2_meals[index].org_index);
                    break;
                case 'dinner':
                    this.removeMeal(this.dinner_meals[index].org_index);
                    break;
                case 'night_snack':
                    this.removeMeal(this.night_snack_meals[index].org_index);
                    break;
            }
        },

        removeMeal: async function(index) {
            console.log('passed index', this.meals[index].pk)
            const response = await axios.delete(`api/meald/${this.meals[index].pk}/`)

            console.log(response)            
            this.getMeal()
        },

        // sets the date object to something HTML can work with
        set_date: function() {
            if (typeof(this.date) == typeof(new Date())) {
                var year = this.date.getFullYear().toString()
                var month = (this.date.getMonth() + 1).toString()
                if (month.length != 2) {
                    month = '0' + month
                }
                var day = this.date.getDate().toString()
                if (day.length != 1) {
                    day = '0' + day
                }
                this.date = year + '-' + month + '-' + day
            }
        },

        getMeal: async function() {
            this.set_date()
            var input = 'api/meal/' + this.date + '/'
            // console.log('getMeal1:' input)
            const response = await axios.get(input)
            // console.log('resp', response)
            this.meals = response.data
            this.breakfast_meals = []
            this.snack1_meals = []
            this.lunch_meals = []
            this.snack2_meals = []
            this.dinner_meals = []
            this.night_snack_meals = []
            this.cal_tot = 0
            for (i=0; i < this.meals.length; i++) {
                this.meals[i] = this.conv_meal(this.meals[i], i)
                this.cal_tot += this.meals[i].eaten_cals()
                // assigns meals to meal times
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
            // console.log('conv_meal')
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

        addRecipe: async function() {
            // add recipe modal, if macros are left out then send through automated macro filter
            
        },

        getOwner: async function() {
            const response = await axios.get('api/user/')
            // console.log('users api call', response)

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

        set_add_meal_modal_data: function(meal_section) {
            this.add_meal_modal_data = meal_section
        },

        parse_modal_func: function(meal_section, serv_index) {
            this.serv_modal_func(meal_section, serv_index)
            this.modal_recipe = this.meals[this.modal_data[0]]
            console.log('RECIPE', this.meals[this.modal_data[0]])
        },

        update_meal_item: function() {
            console.log('update meal item')
            this.set_clear_serv_modal_data()
            this.modal_recipe = new Recipe()
        },

        // serving size
        serv_modal_func: function(meal_section, serv_index) {
            console.log(this.modal_data)
            switch (meal_section) {
                case 'breakfast':
                    this.modal_data.push(this.breakfast_meals[serv_index].org_index);
                    this.modal_data.push('breakfast');
                    this.modal_servings = this.meals[this.modal_data[0]].servings
                    break;
                    case 'snack1':
                    this.modal_data.push(this.snack1_meals[serv_index].org_index);
                    this.modal_data.push('snack1');
                    this.modal_servings = this.meals[this.modal_data[0]].servings
                    break;
                    case 'lunch':
                    this.modal_data.push(this.lunch_meals[serv_index].org_index);
                    this.modal_data.push('lunch');
                    this.modal_servings = this.meals[this.modal_data[0]].servings
                    break;
                    case 'snack2':
                    this.modal_data.push(this.snack2_meals[serv_index].org_index);
                    this.modal_data.push('snack2');
                    this.modal_servings = this.meals[this.modal_data[0]].servings
                    break;
                    case 'dinner':
                    this.modal_data.push(this.dinner_meals[serv_index].org_index);
                    this.modal_data.push('dinner');
                    this.modal_servings = this.meals[this.modal_data[0]].servings
                    break;
                    case 'night_snack':
                    this.modal_data.push(this.night_snack_meals[serv_index].org_index);
                    this.modal_data.push('night_snack');
                    this.modal_servings = this.meals[this.modal_data[0]].servings
                    break;
            }
            console.log('index', this.modal_data)
        },

        set_clear_serv_modal_data: async function() {
            console.log('set_clear_serv...', this.modal_data[0])
            // cal_tot needs to be changed before it is converted to a new obj
            this.cal_tot -= this.meals[this.modal_data[0]].eaten_cals()
            this.meal = this.chng_meal_serv_size(this.meals[this.modal_data[0]])
            this.meal.servings = this.modal_servings
            
            // delete old entry
            const response = await axios.delete(`api/meald/${this.meal.pk}/`)
            console.log(response)
            this.addMeal(this.modal_data[1])

            this.modal_data = []
            this.modal_servings = 1
        },

        chng_meal_serv_size: function(meal_in) {
            var temp = new Recipe()
            console.log('meal in', meal_in)
            // this is to keep remove_meal(org_index) working, do not access in model
            temp.org_index = this.modal_data[0]
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
            if (this.search_cals > 99){
                cals = this.search_cals
            } else if (this.remaining_cal > 150) {
                cals = this.remaining_cal
            } else {
                cals = 450
            }
            var rCals = '&calories=' + cals
            
            // TODO add in diet restrictions
            // Edamam API call
            get = this.sugg_api + ingr + this.recipe_app_id + this.recipe_app_key + rCals
            console.log('sugg req:', get)
            const response = await axios.get(get)
            console.log('suggestion resp:', response)

            // Filter results
            this.recipe = this._parse_recipes(response.data.hits)
            console.log(this.recipe)
        },

        food_search: async function() {
            // var use_NLP = '?nutrition-type=logging&'
            this.loading = true
            this.meal_search = this.meal_search.toLowerCase()
            var ingr = this.meal_search.split(' ')
            // console.log('food search ingr1', ingr)
            ingr = '?ingr=' + ingr.join('%20')
            // console.log('food search ingr2', ingr)
            // get = this.food_api + use_NLP + ingr + this.app_id + this.app_key
            get = this.food_api + ingr + this.food_app_id + this.food_app_key
            // console.log('food search get', get)
            const response = await axios.get(get)
            // console.log('food search response', response)
            this.search_results = response.data.hints
            this.loading = false
            // this.search_results = response
        },

        search_modal_handler: function(meal_time) {
            this.set_add_meal_modal_data(meal_time)
            this.sugg_add_meal()
        },

        sugg_add_meal: function() {
            this.meal = this.recipe
            // this.suggestion()
            this.addMeal(this.add_meal_modal_data)
            this.add_meal_modal_data = ''
        },

        _parse_recipes: function(hits) {
            // This takes in 10 recipe hits from API and searches for most relevent
            var closest = new Recipe()
            var recipes = []
            // builds list of recipes
            for (i=0; i < hits.length; i++) {
                var rcp = new Recipe()
                rcp.title = hits[i].recipe.label
                rcp.url = hits[i].recipe.url
                rcp.calories = Math.floor(hits[i].recipe.calories / hits[i].recipe.yield)
                rcp.tot_calories = Math.floor(hits[i].recipe.calories)
                rcp.tot_serv = hits[i].recipe.yield
                rcp.servings = 1
                if (hits[i].recipe.digest['Fat'] != null) {
                    rcp.fat = hits[i].recipe.digest['Fat']
                }
                if (hits[i].recipe.digest['Carbs'] != null) {
                    rcp.carb = hits[i].recipe.digest['Carbs']
                }
                if (hits[i].recipe.digest['Protein'] != null) {
                    rcp.pro = hits[i].recipe.digest['Protein']
                }
                if (hits[i].recipe.image != null) {
                    rcp.image = hits[i].recipe.image
                } else {
                    rcp.image = "../img/default_meal.jpg"
                }
                if (hits[i].recipe.totalNutrients.totalTime != null) {
                    rcp.cooktime = hits[i].recipe.totalNutrients.totalTime
                }
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

        clear_search: function() {
            this.recipe = new Recipe()
        },

        // grabs api keys
        getkeys: async function() {
            const response = await axios.get('api/keys/')
            this.recipe_app_id += response.data.recipe_api_id
            this.recipe_app_key += response.data.recipe_api_key
            this.food_app_id += response.data.food_api_id
            this.food_app_key += response.data.food_api_key
        }
    },
    mounted: function() {
        // USER assigned in base.html
        this.getOwner()
        this.getkeys()
        this.cal_tot = 0
        this.getMeal()
        this.set_date()
    },

    updated: function() {
        window.localStorage.date = this.date
    }
});