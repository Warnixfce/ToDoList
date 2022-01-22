import express, {Express} from "express";
import bodyParser from "body-parser";
import {MySqlDatabase} from "./database-mysql";

export class ExpressDelivery{
    private port = 3050;
    public init(): void {
        let app = express();
        let database = new MySqlDatabase()
        database.Init();
        this.setupHeaders(app);
        this.setupRoutes(app, database)
        this.startListening(app);
    }

    private startListening(app: Express) {
        app.listen(this.port, () => console.log(`Server running on port ${this.port}`));
    }

    private setupHeaders(app: Express): void {
        app.use(bodyParser.json());
        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
            // @ts-ignore
            res.setHeader('Access-Control-Allow-Credentials', true)
            next();
        });
    }

    private setupRoutes(app: Express, database: MySqlDatabase) {
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