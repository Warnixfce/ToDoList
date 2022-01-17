import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:3050/'

export const store = new Vuex.Store({
    state: {
        filter: 'all',
        todos: []
    },
    getters: {
        remaining(state) {
            return state.todos.filter(todo => !todo.completed).length
        },
        anyRemaining(state, getters) {
            return getters.remaining != 0
        },
        todosFiltered(state) {            
            if (state.filter == 'all') {
                return state.todos
            } else if (state.filter == 'active') {
                return state.todos.filter(todo => !todo.completed)
            } else if (state.filter == 'completed') {
                return state.todos.filter(todo => todo.completed)
            }

            return state.todos
        },
        showClearCompletedButton(state) {
            return state.todos.filter(todo => todo.completed).length > 0
        }
    },
    mutations: {
        addTodo(state, todo) {
            state.todos.push({
                id: todo.id,
                title: todo.title,
                completed: false,
                editing: false,
            })
        },
        updateTodo(state, todo) {            
            const index = state.todos.findIndex(item => item.id == todo.id)
            state.todos[index].completed = todo.completed
            state.todos[index].title = todo.title            
        },
        deleteTodo(state, id) {
            const index = state.todos.findIndex(item => item.id == id)
            state.todos.splice(index, 1)
        },
        checkAll(state, checked) {
            state.todos.forEach(todo => (todo.completed = checked))
        },
        updateFilter(state, filter) {
            state.filter = filter
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed)
        },
        retrieveTodos(state, todos) {
            state.todos = todos
        }
    },

    actions: {
        retrieveTodos(context) {
            axios.get('/todos')
                .then(response => {
                    context.commit('retrieveTodos', response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        addTodo(context, todo) {
            axios.post('/todos', {
                title: todo.title,
                completed: false,
            })
                .then(response => {
                    context.commit('addTodo', response.data)
                })
                .catch(error => {
                    console.log(error)
                })
            setTimeout(() => {
                context.commit('addTodo', todo)
            }, 100)
        },
        updateTodo(context, todo) {
            console.log(todo)
            axios.patch('/todos/' + todo.id, {
                title: todo.title,
                completed: todo.completed,
            })
                .then(response => {                    
                    response.data.id = todo.id
                    context.commit('updateTodo', response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deleteTodo(context, id) {
            axios.delete('/todos/' + id)
                .then(response => {
                    context.commit('deleteTodo', id)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        checkAll(context, checked) {
            axios.patch('/todosCheckAll', {
                completed: checked,
            })
                .then(response => {
                    context.commit('checkAll', checked)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        updateFilter(context, filter) {
            context.commit('updateFilter', filter)
        },
        clearCompleted(context) {
            const completed = context.state.todos
                .filter(todo => todo.completed)
                .map(todo => todo.id)

            axios.delete('/todosDeleteCompleted', {
                data: {
                    todos: completed
                }
            })
                .then(response => {
                    context.commit('clearCompleted')
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
})