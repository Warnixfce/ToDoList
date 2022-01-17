const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

const table = 'todos'

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)    
    next();
});


// MySql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PcB9elN6DelCis76',
  database: 'node22_mysql'
});

// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// retrieveAll
app.get('/todos', (req, res) => {
  const sql = `SELECT * FROM ${table}`;

  connection.query(sql, (error, results) => {
    if (error) throw error;    
    res.json(results);
  });
});

// addTodo
app.post('/todos', (req, res) => {
  const sql = `INSERT INTO ${table} SET ?`;

  const todoObj = {
    id: req.body.id,
    title: req.body.title,
    completed: req.body.completed
  };

  connection.query(sql, todoObj, error => {
    if (error) throw error;
    res.json(todoObj);
  });
});

// updateTodo
app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todoObj = {
    id: req.body.id,
    title: req.body.title,
    completed: req.body.completed
  };
  const sql = `UPDATE ${table} SET title = '${title}', completed='${completed ? 1:0}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.json(todoObj);
  });
});

// deleteTodo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM ${table} WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send();
  });
});

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

