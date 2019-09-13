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
            const response = await axios.post('api/add_meal/', {title: this.meal, calories: this.cal_in})
            console.log(response)
            // // add todo to this.todos
            // this.todos.push({text: this.todo, completed: false})
            this.meal = ''
        },
        removeMeal: async function(index) {
            const response = await axios.delete(`/api/remove_meal/${this.todos[index].pk}/`)
            console.log(response)            
            // remove todo from this.todos
            // this.todos.splice(index, 1)
        },
    },
    mounted: function() {
        // mounted() handles any logic you want prior to the vue app mounting
        // this is a good place to request any data you want to render, such as from localStorage (what we're doing here), or from an API call
    },
    computed: {
    },
});
