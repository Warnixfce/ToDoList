import {Express} from "express";
import {ITodosRepository} from "../i-todos-repository";

export class Routes{
    private readonly database: ITodosRepository;

    constructor(database: ITodosRepository) {
        this.database = database;
    }

    public setupRoutes(app: Express) {
        this.indexRoute(app);
        this.getRoute(app);
        this.addRoute(app);
        this.updateRoute(app);
        this.deleteRoute(app);
    }

    private deleteRoute(app: Express) {
        app.delete('/todos/:id', (req, res) => {
            const {id} = req.params;
            this.database.Delete(id, () => res.send())
        });
    }

    private updateRoute(app: Express) {
        app.patch('/todos/:id', (req, res) => {
            const todoObj = {
                id: req.params,
                title: req.body.title,
                completed: req.body.completed
            };
            this.database.Update(todoObj, results => res.json(results))
        });
    }

    private addRoute(app: Express) {
        app.post('/todos', (req, res) => {
            const todoObj = {
                id: req.body.id,
                title: req.body.title,
                completed: req.body.completed
            };

            this.database.Add(todoObj, results => res.json(results))
        });
    }

    private getRoute(app: Express) {
        app.get('/todos', (req, res) => {
            this.database.Retrieve(results => res.json(results))
        });
    }

    private indexRoute(app: Express) {
        app.get('/', (req, res) => {
            res.send('Welcome to my API!');
        });
    }
}