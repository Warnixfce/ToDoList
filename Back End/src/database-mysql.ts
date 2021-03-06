import {Connection} from "mysql";
import {ITodosRepository} from "./i-todos-repository";

const databaseMysql = require('mysql');

export class MySqlTodosRepository implements ITodosRepository {
    private connection: Connection;
    private table = 'todos'

    public Init(): void {
        this.connection = databaseMysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'PcB9elN6DelCis76',
            database: 'node22_mysql'
        });
        this.CheckConnection();
    }

    Retrieve(callback): void {
        const sql = `SELECT * FROM ${this.table}`;

        this.connection.query(sql, (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    Add(todoObj: { id: any; completed: any; title: any }, callback) {
        const sql = `INSERT INTO ${this.table} SET ?`;

        this.connection.query(sql, todoObj, error => {
            if (error) throw error;
            callback(todoObj)
        });
    }

    Delete(id: any, callback: () => any) {
        const sql = `DELETE FROM ${this.table} WHERE id= ${id}`;

        this.connection.query(sql, error => {
            if (error) throw error;
            callback()
        });
    }

    Update(todoObj: { id: any; completed: any; title: any }, callback: (results) => any) {
        const sql = `UPDATE ${this.table} SET title = '${todoObj.title}', completed='${todoObj.completed ? 1:0}' WHERE id =${todoObj.id}`;

        this.connection.query(sql, error => {
            if (error) throw error;
            callback(todoObj);
        });
    }

    private CheckConnection() {
        this.connection.connect(error => {
            if (error) throw error;
            console.log('Database server running!');
        });
    }
}