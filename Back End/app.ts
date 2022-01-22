import {ExpressDelivery} from "./src/express-delivery";
import {Routes} from "./src/routes/routes";
import {ITodosRepository} from "./src/i-todos-repository";
import {MySqlTodosRepository} from "./src/database-mysql";

function provideRepository(): ITodosRepository {
    let db = new MySqlTodosRepository()
    db.Init();
    return db;
}

let db = provideRepository()
let routes = new Routes(db)

const delivery = new ExpressDelivery(routes);
delivery.init();