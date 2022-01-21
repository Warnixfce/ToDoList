const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

let setHeaders = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next();
};
app.use(setHeaders);


const mysqldb = new MySqlDatabase();
mysqldb.Init()

// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// retrieveAll
app.get('/todos', (req, res) => {
  mysqldb.Retrieve(results => res.json(results))
});

// addTodo
app.post('/todos', (req, res) => {
  const todoObj = {
    id: req.body.id,
    title: req.body.title,
    completed: req.body.completed
  };

  mysqldb.Add(todoObj, results => res.json(results))
});

// updateTodo
app.patch('/todos/:id', (req, res) => {
  const todoObj = {
    id: req.params,
    title: req.body.title,
    completed: req.body.completed
  };
  mysqldb.Update(todoObj,results => res.json(results))
});

// deleteTodo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  mysqldb.Delete(id, () => res.send())
});

mysqldb.CheckConnection();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

