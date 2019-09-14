axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

const app = new Vue({
    el: '#app',
    delimiters: ['${', '}'], // set custom delimiters here instead of {{}}    
    data: {
        meals: [],
        meal: '',
        owner: '',
        cal_in: '',
    },
    methods: {
        addMeal: async function() {
            const response = await axios.post('api/meal/', {title: this.meal, calories: this.cal_in})
            console.log(response)
            // // add meal to this.meals
            // this.meals.push({text: this.meal, completed: false})
            this.meal = ''
            this.cal_in = ''
            this.getMeal()
        },
        removeMeal: async function(index) {
            const response = await axios.delete(`api/meal/${this.meals[index].pk}/`)
            console.log(response)            
            // remove meal from this.meals
            // this.meals.splice(index, 1)
            this.getMeal()
        },
        getMeal: async function() {
            const response = await axios.get('api/meal/')
            this.meals = response.data
            // this.owner = this.meal[0].owner
        }
    },
    mounted: function() {
        this.getMeal()
    }
});
