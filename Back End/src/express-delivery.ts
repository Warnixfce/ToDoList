import express, {Express} from "express";
import bodyParser from "body-parser";
import {Routes} from "./routes/routes";

export class ExpressDelivery{
    private port = 3050;
    private readonly routes: Routes;

    constructor(routes: Routes) {
        this.routes = routes;
    }

    public init(): void {
        let app = express();
        this.setupHeaders(app);
        this.routes.setupRoutes(app)
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
}