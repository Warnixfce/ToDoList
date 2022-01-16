import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = '' ///////////PONER LA URL DE LA API

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
            if(state.filter == 'all') {
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
          state.todos.splice(index, 1, {
             'id': todo.id,
             'title': todo.title,
             'completed': todo.completed,
             'editing': todo.editing,
            })
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
            axios.get('./todos')
            .then(response => {
                context.commit('retrieveTodos', response.data)
            })
            .catch(error => {
                console.log(error)
            })
        },
        addTodo(context, todo) {
            axios.post('./todos', //{ ///////// AGREGAR
                //title = todo.title,
                //completed: false,
            //}
            )
            .then(response => {
                context.commit('addTodo', response.data)
            })
            .catch(error => {
                console.log(error)
            })
            setTimeout(() => { ///////////////////////// ELIMINAR 
                context.commit('addTodo', todo)/////
            }, 100)//////
        },
        updateTodo(context, todo) {
            axios.patch('/todos/' + todo.id, {
                title: todo.title,
                completed: todo.completed,
            })
            .then(response => {
                context.commit('updateTodo', response.data)
            })
            .catch(error => {
                console.log(error)
            })            
            
            setTimeout(() => { /////////// ELIMINAR 
                context.commit('updateTodo', todo)  ///////////
            }, 100) ////////
        },
        deleteTodo(context, id) {  ///////////////////////////////////////////// ACLARACION: modificacion en backend
            axios.delete('/todos/' + id)
            .then(response => {
                context.commit('deleteTodo', id)
            })
            .catch(error => {
                console.log(error)
            })
            setTimeout(() => { /////////// ELIMINAR 
                context.commit('deleteTodo', id) ///////////
            }, 100)///////////
        },
        checkAll(context, checked) {     ///////////////////////////////////////// ACLARACION: modificacion en backend
            axios.patch('/todosCheckAll', {
                completed: checked,
            })
            .then(response => {
                context.commit('checkAll', checked)
            })
            .catch(error => {
                console.log(error)
            })            
            setTimeout(() => { /////////// ELIMINAR 
                context.commit('checkAll', checked)///////////
            }, 100)///////////
        },
        updateFilter(context, filter) {
            setTimeout(() => { /////////// ELIMINAR 
                context.commit('updateFilter', filter)/////////// <--- ESTO NO ELIMINAR
            }, 100)///////////
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
            setTimeout(() => { /////////// ELIMINAR 
                context.commit('clearCompleted')///////////
            }, 100)///////////
        }
    }
})