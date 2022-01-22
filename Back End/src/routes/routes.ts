import {Express} from "express";
import {MySqlDatabase} from "../database-mysql";

export class Routes{
    public setupRoutes(app: Express, database: MySqlDatabase) {
        this.indexRoute(app);
        this.getRoute(app, database);
        this.addRoute(app, database);
        this.updateRoute(app, database);
        this.deleteRoute(app, database);
    }

    private deleteRoute(app: Express, database: MySqlDatabase) {
        app.delete('/todos/:id', (req, res) => {
            const {id} = req.params;
            database.Delete(id, () => res.send())
        });
    }

    private updateRoute(app: Express, database: MySqlDatabase) {
        app.patch('/todos/:id', (req, res) => {
            const todoObj = {
                id: req.params,
                title: req.body.title,
                completed: req.body.completed
            };
            database.Update(todoObj, results => res.json(results))
        });
    }

    private addRoute(app: Express, database: MySqlDatabase) {
        app.post('/todos', (req, res) => {
            const todoObj = {
                id: req.body.id,
                title: req.body.title,
                completed: req.body.completed
            };

            database.Add(todoObj, results => res.json(results))
        });
    }

    private getRoute(app: Express, database: MySqlDatabase) {
        app.get('/todos', (req, res) => {
            database.Retrieve(results => res.json(results))
        });
    }

    private indexRoute(app: Express) {
        app.get('/', (req, res) => {
            res.send('Welcome to my API!');
        });
    }
}